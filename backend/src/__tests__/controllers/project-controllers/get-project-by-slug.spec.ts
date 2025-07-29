import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { Request, Response } from "express";
import { getProjectBySlug } from "../../../controllers/projectController";

describe("getProjectById", () => {
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

  it("should return a project by its ID", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    const project = await prisma.project.create({
      data: {
        name: "Project 1",
        description: "Description 1",
        createdBy: user.uuid,
        slug: "project-1",
        status: "active",
      },
      include: { creator: true },
      omit: { createdBy: true },
    });

    const req = { params: { slug: project.slug } } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getProjectBySlug(req, res);

    const apiProjects = await prisma.project.findMany({
      include: {
        teams: true,
        creator: true,
      },
      omit: { createdBy: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ project: apiProjects[0] });
  });

  it("should return 404 if project not found", async () => {
    const req = { params: { slug: "non-existent-slug" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getProjectBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Project not found" });
  });
});
