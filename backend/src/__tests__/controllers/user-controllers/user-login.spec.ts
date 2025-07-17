import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { Request, Response } from "express";
import { userLogin } from "../../../controllers/userControllers";
import argon2 from "argon2";

describe("userLogin", () => {
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
      body: {
        email: "invalid-email", // Invalid email format
        password: "password123",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("should return 401 if email is invalid", async () => {
    // setup
    const req = {
      body: {
        email: "toto@email.com", // Invalid email format
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 401 if password is invalid", async () => {
    // setup
    await prisma.user.create({
      data: {
        username: "toto",
        email: "toto@email.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$Q2FjaGVkU2FsdA$6QnQn6Qw6QnQn6Qw6QnQn6Qw6QnQn6Qw6QnQn6Qw6QnQn6Qw6QnQn6Qw6QnQn6Qw",
      },
    });
    const req = {
      body: {
        email: "toto@email.com", // Invalid email format
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 200 if password is valid", async () => {
    // setup
    const hashedPassword = await argon2.hash("Password123@");
    await prisma.user.create({
      data: {
        username: "toto",
        email: "toto@email.com",
        password: hashedPassword,
      },
    });
    const req = {
      body: {
        email: "toto@email.com", // Invalid email format
        password: "Password123@",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
    });
  });
});
