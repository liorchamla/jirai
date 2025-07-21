import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { updateProject } from "../../../controllers/projectController";
import { Request, Response } from "express";

describe("updateProject", () => {
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

  it("should update a project", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });
    const project = await prisma.project.create({
      data: {
        slug: "test-project",
        name: "Test Project",
        description: "This is a test project",
        status: "active",
        createdBy: user.uuid,
      },
    });

    const req = {
      params: { slug: project.slug },
      body: {
        name: "Updated Project",
        description: "This is an updated test project",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateProject(req, res);

    const updatedProject = await prisma.project.findUnique({
      where: { slug: project.slug },
      include: { creator: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ project: updatedProject });
  });

  it("should return 404 if project not found", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user2@example.com",
        username: "user2",
        password: "password2",
      },
    });

    const req = {
      params: { slug: "non-existent-slug" },
      body: {
        name: "Updated Project",
        description: "This is an updated test project",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateProject(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Project not found" });
  });
});
