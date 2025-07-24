import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { updateTeam } from "../../../controllers/teamController";
import { Request, Response } from "express";

describe("upsdateTeam", () => {
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

  it("should update a team", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const team = await prisma.team.create({
      data: {
        slug: "old-team-slug",
        name: "Old Team Name",
        creator: { connect: { uuid: user.uuid } },
      },
    });

    const req = {
      params: {
        slug: team.slug,
      },
      body: {
        name: "Updated Team Name",
      },
      user: { uuid: user.uuid },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateTeam(req, res);

    const updatedTeam = await prisma.team.findUnique({
      where: { slug: team.slug },
      include: { creator: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ team: updatedTeam });
  });

  it("should return 404 if team not found", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const req = {
      params: {
        slug: "non-existent-slug",
      },
      body: {
        name: "Updated Team Name",
      },
      user: { uuid: user.uuid },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Team not found" });
  });
});
