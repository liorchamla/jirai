import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanDatabase } from "../../utils/test-db-utils";
import prisma from "../../../utils/prisma";
import { getCommentById } from "../../../controllers/commentControllers";
import { Request, Response } from "express";

describe("getCommentById", () => {
  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await cleanDatabase();
  });

  it("should return a comment by ID", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password",
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

    const status = await prisma.status.create({
      data: {
        id: 1,
        name: "thinking",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Epic 1",
        description: "Description 1",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    await prisma.ticket.create({
      data: {
        title: "Test Ticket",
        description: "Ticket Description",
        epicId: epic.id,
        createdBy: user.uuid,
        assignedTo: user.uuid,
        statusId: status.id,
        priority: "low",
      },
    });

    const comment = await prisma.comment.create({
      data: {
        content: "Test Comment",
        createdBy: user.uuid,
        epicId: epic.id,
      },
    });

    const req = {
      params: { id: comment.id },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getCommentById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ...comment,
      creator: {
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        position: user.position,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      epic: {
        id: epic.id,
        title: epic.title,
        description: epic.description,
        priority: epic.priority,
        projectSlug: epic.projectSlug,
        createdBy: epic.createdBy,
        assignedTo: epic.assignedTo,
        statusId: epic.statusId,
        createdAt: epic.createdAt,
        updatedAt: epic.updatedAt,
      },
      ticket: null,
    });
  });

  it("should return 404 if comment not found", async () => {
    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getCommentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });
});
