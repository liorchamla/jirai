import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getEpicById } from "../../../controllers/epicControllers";
import type { Request, Response } from "express";

describe("getEpicById", () => {
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

  it("should return epic by id", async () => {
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
        name: "Thinking",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Test Epic",
        description: "Test Description",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: epic.id.toString() },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getEpicById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: epic.id,
        title: "Test Epic",
        description: "Test Description",
        priority: "high",
        projectSlug: project.slug,
        creator: expect.objectContaining({
          email: "user1@example.com",
          username: "user1",
        }),
      })
    );
  });

  it("should return 404 if epic not found", async () => {
    const req = {
      params: { id: "999" },
    } as unknown as Request;

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

    await prisma.epic.create({
      data: {
        title: "Test Epic",
        description: "Test Description",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getEpicById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Epic not found" });
  });

  it("should handle invalid id parameter", async () => {
    const req = {
      params: { id: "invalid" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getEpicById(req, res);

    // Invalid id will be converted to NaN, which won't find any epic
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Epic not found" });
  });
});
