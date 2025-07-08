import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { updateUser } from "../../../controllers/userControllers";
import { Request, Response } from "express";
import argon2 from "argon2";

describe("updateUser", () => {
  beforeEach(async () => {
    // Clear the users table before each test
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.user.deleteMany({});
  });

  it("should return 422 if data is invalid", async () => {
    // setup
    const req = {
      params: { uuid: "test-uuid" },
      body: {
        username: "testuser",
        email: "invalid-email", // Invalid email format
        password: "password123",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: [
        {
          code: "invalid_string",
          message: "Invalid email",
          path: ["email"],
          validation: "email",
        },
        {
          code: "custom",
          message: "Password must contain at least one uppercase letter",
          path: ["password"],
        },
        {
          code: "custom",
          message: "Password must contain at least one special character",
          path: ["password"],
        },
      ],
    });
  });

  it("should return 400 if email already exists", async () => {
    // setup
    const hashedPassword = await argon2.hash("Password123@");
    await prisma.user.create({
      data: {
        username: "existinguser",
        email: "existinguser@example.com",
        password: hashedPassword,
      },
    });
    const user = await prisma.user.findUnique({
      where: { email: "existinguser@example.com" },
    });
    const req = {
      params: { uuid: user.uuid },
      body: {
        username: "testuser",
        email: "existinguser@example.com",
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email already in use",
    });
  });

  it("should return 200 and update user if data is valid", async () => {
    // setup
    const hashedPassword = await argon2.hash("Password123@");
    const user = await prisma.user.create({
      data: {
        username: "testuser",
        email: "testuser@example.com",
        password: hashedPassword,
      },
    });
    const req = {
      params: { uuid: user.uuid },
      body: {
        username: "updateduser",
        email: "updateduser@example.com",
        password: "UpdatedPassword123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
      user: expect.objectContaining({
        uuid: user.uuid,
        username: "updateduser",
        email: "updateduser@example.com",
      }),
    });
  });
});
