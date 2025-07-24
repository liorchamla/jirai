import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { createTeam } from "../../../controllers/teamController";
import { Request, Response } from "express";

describe("createTeam", () => {
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

  it("should create a new team", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const req = {
      body: {
        name: "New Team",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTeam(req, res);

    const team = await prisma.team.findFirst({
      where: { name: "New Team" },
      include: { creator: true },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ team });
  });

  it("should return 422 if data is invalid", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password1",
      },
    });

    const req = {
      body: {
        name: "", // Invalid name
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        _errors: [],
        name: {
          _errors: expect.arrayContaining([
            expect.stringContaining("at least 2 characters"),
          ]),
        },
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const req = {
      body: {
        name: "Valid Team Name",
      },
      user: undefined, // No authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
