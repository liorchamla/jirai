import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { createUser } from "../../../controllers/userControllers";
import { Request, Response } from "express";
import argon2 from "argon2";

describe("createUser", () => {
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

  it("should return 422 if data is invalid", async () => {
    // setup
    const req = {
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

    await createUser(req, res);

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

  it("should return 409 if email already exists", async () => {
    //setup
    await prisma.user.create({
      data: {
        username: "existinguser",
        email: "existinguser@example.com",
        password: "password123",
      },
    });
    const req = {
      body: {
        username: "newuser",
        email: "existinguser@example.com",
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email already in use",
    });
  });

  it("should return 409 if username already exists", async () => {
    //setup
    await prisma.user.create({
      data: {
        username: "existinguser",
        email: "existinguser@example.com",
        password: "password123",
      },
    });
    const req = {
      body: {
        username: "existinguser", // Same username
        email: "exemple@example.com",
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Username already in use",
    });
  });

  it("should create a new user if data is valid", async () => {
    //setup
    // Create a creator user for teams first
    const creator = await prisma.user.create({
      data: {
        username: "creator",
        email: "creator@example.com",
        password: "hashedpassword",
      },
    });

    // Create teams
    await prisma.team.createMany({
      data: [
        { name: "team1", slug: "team1", createdBy: creator.uuid },
        { name: "team2", slug: "team2", createdBy: creator.uuid },
      ],
    });

    const req = {
      body: {
        username: "newuser",
        email: "newuser@example.com",
        password: "Password123@",
        teams: ["team1", "team2"], // Ces valeurs correspondent aux noms des équipes
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createUser(req, res);

    const user = await prisma.user.findUnique({
      where: { email: "newuser@example.com" },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(user);

    const userWithPassword = await prisma.user.findUnique({
      where: { email: "newuser@example.com" },
      select: { password: true },
    });

    expect(userWithPassword).not.toBeNull();
    expect(userWithPassword!.password).not.toBe("Password123@"); // Ensure password is hashed

    const validPassword = await argon2.verify(
      userWithPassword!.password,
      "Password123@"
    );

    expect(validPassword).toBe(true); // Ensure password verification works
  });
});
