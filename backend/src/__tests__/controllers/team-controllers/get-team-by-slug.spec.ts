import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getTeamBySlug } from "../../../controllers/teamController";
import { Request, Response } from "express";

describe("getTeamBySlug", () => {
  beforeEach(async () => {
    // Clear the teams table before each test
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should return a team by slug", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const team = await prisma.team.create({
      data: {
        slug: "test-team",
        name: "Test Team",
        createdBy: user.uuid,
      },
      include: { creator: true },
      omit: { createdBy: true },
    });

    const req = {
      params: {
        slug: team.slug,
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getTeamBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ team });
  });

  it("should return 404 if team not found", async () => {
    const req = {
      params: {
        slug: "non-existent-team",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getTeamBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
  });
});
