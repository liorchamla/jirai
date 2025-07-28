import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { Request, Response } from "express";
import { getAllTeams } from "../../../controllers/teamController";

describe("getAllTeams", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await prisma.project.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.project.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should return all teams", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    await prisma.team.createManyAndReturn({
      data: [
        {
          slug: "test-team",
          name: "Test Team",
          createdBy: user.uuid,
        },
        {
          slug: "another-team",
          name: "Another Team",
          createdBy: user.uuid,
        },
      ],
      omit: { createdBy: true }, // Omit createdBy if not needed in response
      include: { creator: true }, // Include user information if needed
    });

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllTeams(req, res);

    const apiTeams = await prisma.team.findMany({
      include: {
        creator: true,
        members: true,
      },
      omit: { createdBy: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ teams: apiTeams });
  });

  it("should return an empty array if no teams exist", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllTeams(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ teams: [] });
  });
});
