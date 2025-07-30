import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { Request, Response } from "express";
import { deleteTeam } from "../../../controllers/teamController";

describe("deleteTeam", () => {
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

  it("should delete a team", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const team = await prisma.team.create({
      data: {
        slug: "team-slug",
        name: "Team Name",
        createdBy: user.uuid,
      },
    });

    const req = {
      params: {
        slug: team.slug,
      },
      user: { uuid: user.uuid },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as Response;

    await deleteTeam(req, res);

    const deletedTeam = await prisma.team.findUnique({
      where: { slug: team.slug },
    });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(deletedTeam).toBeNull();
  });

  it("should return 404 if team not found", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    await prisma.team.create({
      data: {
        slug: "team-slug",
        name: "Team Name",
        createdBy: user.uuid,
      },
    });

    const req = {
      params: {
        slug: "non-existent-slug",
      },
      user: { uuid: user.uuid },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Team not found",
    });
  });
});
