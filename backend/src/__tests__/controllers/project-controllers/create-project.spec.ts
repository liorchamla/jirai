import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { createProject } from "../../../controllers/projectController";
import { Request, Response } from "express";

describe("createProject", () => {
  beforeEach(async () => {
    // Clear the projects table before each test
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should create a new project", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    const req = {
      body: {
        name: "New Project",
        description: "Project description",
        status: "active",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createProject(req, res);

    const project = await prisma.project.findFirst({
      where: { name: "New Project" },
      include: { creator: true },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ project });
  });

  it("should return 400 if data is invalid", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    const req = {
      body: {
        name: "", // Invalid name
        description: "Project description",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: expect.any(String) }),
        ]),
      }),
    });
  });
});
