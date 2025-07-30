import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getAllProjects } from "../../../controllers/projectController";
import type { Request, Response } from "express";

describe("getAllProjects", () => {
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

  it("should return all projects", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
      },
    });

    await prisma.project.createManyAndReturn({
      data: [
        {
          name: "Project 1",
          description: "Description 1",
          createdBy: user.uuid,
          slug: "project-1",
          status: "active",
        },
        {
          name: "Project 2",
          description: "Description 2",
          createdBy: user.uuid,
          slug: "project-2",
          status: "active",
        },
        {
          name: "Project 3",
          description: "Description 3",
          createdBy: user.uuid,
          slug: "project-3",
          status: "active",
        },
      ],
      include: { creator: true },
      omit: { createdBy: true },
    });
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    await getAllProjects(req, res);

    const apiProjects = await prisma.project.findMany({
      include: {
        teams: true,
        creator: true,
        epics: true,
      },
      omit: { createdBy: true },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ projects: apiProjects });
  });
});

it("should return an empty array if no projects exist", async () => {
  const req = {} as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
  await getAllProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ projects: [] });
});
