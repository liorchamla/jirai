import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getAllEpics } from "../../../controllers/epicControllers";
import type { Request, Response } from "express";

describe("getAllEpics", () => {
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

  it("should return all epics", async () => {
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

    await prisma.epic.createManyAndReturn({
      data: [
        {
          title: "Epic 1",
          description: "Description 1",
          priority: "high",
          projectSlug: project.slug,
          createdBy: user.uuid,
          statusId: 1,
        },
        {
          title: "Epic 2",
          description: "Description 2",
          priority: "medium",
          projectSlug: project.slug,
          createdBy: user.uuid,
          statusId: 1,
        },
        {
          title: "Epic 3",
          description: "Description 3",
          priority: "low",
          projectSlug: project.slug,
          createdBy: user.uuid,
          statusId: 1,
        },
      ],
    });

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllEpics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Epic 1",
          description: "Description 1",
          priority: "high",
          creator: expect.objectContaining({
            email: "user1@example.com",
            username: "user1",
          }),
        }),
        expect.objectContaining({
          title: "Epic 2",
          description: "Description 2",
          priority: "medium",
        }),
        expect.objectContaining({
          title: "Epic 3",
          description: "Description 3",
          priority: "low",
        }),
      ])
    );
  });

  it("should return empty array when no epics exist", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllEpics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
