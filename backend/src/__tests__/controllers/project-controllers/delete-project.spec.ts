import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { deleteProject } from "../../../controllers/projectController";
import { Request, Response } from "express";

describe("deleteProject", () => {
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

  it("should delete a project", async () => {
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
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteProject(req, res);

    const deletedProject = await prisma.project.findUnique({
      where: { slug: project.slug },
    });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(deletedProject).toBeNull();
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
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Project not found" });
  });
});
