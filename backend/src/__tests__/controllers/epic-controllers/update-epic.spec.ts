import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { updateEpic } from "../../../controllers/epicControllers";
import { Request, Response } from "express";

describe("updateEpic", () => {
  beforeEach(async () => {
    // Clear the epics table before each test
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

  it("should update an epic", async () => {
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
        name: "To Do",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: epic.id.toString() },
      body: {
        title: "Updated Epic",
        description: "Updated Description",
        priority: "high",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateEpic(req, res);

    const updatedEpic = await prisma.epic.findUnique({
      where: { id: epic.id },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedEpic);
  });

  it("should update only provided fields (partial update)", async () => {
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
        name: "To Do",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: epic.id.toString() },
      body: {
        title: "Updated Title Only",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateEpic(req, res);

    const updatedEpic = await prisma.epic.findUnique({
      where: { id: epic.id },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(updatedEpic?.title).toBe("Updated Title Only");
  });

  it("should return 422 if data is invalid", async () => {
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
        name: "To Do",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: epic.id.toString() },
      body: {
        priority: "invalid", // Invalid priority
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateEpic(req, res);

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
