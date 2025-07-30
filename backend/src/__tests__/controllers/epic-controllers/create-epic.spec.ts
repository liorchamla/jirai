import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { createEpic } from "../../../controllers/epicControllers";
import { Request, Response } from "express";

describe("createEpic", () => {
  beforeEach(async () => {
    // Clear the tables before each test
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
  });

  it("should create a new epic", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    const project = await prisma.project.create({
      data: {
        name: "Test Project",
        description: "Test Description",
        slug: "test-project",
        status: "active",
        createdBy: user.uuid,
      },
    });

    await prisma.status.create({
      data: {
        id: 1,
        name: "thinking",
      },
    });

    const req = {
      body: {
        title: "New Epic",
        description: "Epic description",
        priority: "high",
        projectSlug: project.slug,
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createEpic(req, res);

    const epic = await prisma.epic.findFirst({
      where: { title: "New Epic" },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(epic);
  });

  it("should return 422 if data is invalid", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    await prisma.status.create({
      data: {
        id: 1,
        name: "thinking",
      },
    });

    const project = await prisma.project.create({
      data: {
        name: "Test Project",
        description: "Test Description",
        slug: "test-project",
        status: "active",
        createdBy: user.uuid,
      },
    });

    const req = {
      body: {
        title: "", // Invalid title
        description: "Epic description",
        priority: "high",
        projectSlug: project.slug,
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createEpic(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: expect.any(String) }),
        ]),
      }),
    });
  });
});
