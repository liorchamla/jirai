import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getUserById } from "../../../controllers/userControllers";
import { Request, Response } from "express";

describe("getUserById", () => {
  beforeEach(async () => {
    // Clear the users table before each test
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.user.deleteMany({});
  });

  it("should return a user by ID", async () => {
    // setup
    const user = await prisma.user.create({
      data: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      },
    });
    const req = { params: { uuid: user.uuid } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("should return 404 if user not found", async () => {
    // setup
    const req = { params: { uuid: "non-existent-uuid" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
