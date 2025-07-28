import { describe, it, expect, afterAll, vi, beforeEach } from "vitest";
import { getAllUsers } from "../../../controllers/userControllers";
import { Request, Response } from "express";
import prisma from "../../../utils/prisma";

describe("getAllUsers", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await prisma.teamMember.deleteMany({});
    await prisma.teamProject.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.teamMember.deleteMany({});
    await prisma.teamProject.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should return all users", async () => {
    // setup
    await prisma.user.createManyAndReturn({
      data: [
        {
          email: "user1@example.com",
          username: "user1",
          password: "password1",
        },
        {
          email: "user2@example.com",
          username: "user2",
          password: "password2",
        },
        {
          email: "user3@example.com",
          username: "user3",
          password: "password3",
        },
      ],
    });
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllUsers(req, res);

    const apiUsers = await prisma.user.findMany({
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: apiUsers });
  });

  it("should return an empty array if no users exist", async () => {
    // setup
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: [] });
  });
});
