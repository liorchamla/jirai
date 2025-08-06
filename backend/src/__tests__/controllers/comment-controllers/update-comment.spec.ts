import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanDatabase } from "../../utils/test-db-utils";
import prisma from "../../../utils/prisma";
import { Request, Response } from "express";
import { updateComment } from "../../../controllers/commentControllers";

describe("updateComment", () => {
  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await cleanDatabase();
  });

  it("should update a comment", async () => {
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

    const ticket = await prisma.ticket.create({
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
        epicId: epic.id,
        ticketId: ticket.id,
        createdBy: user.uuid,
      },
    });

    const req = {
      body: {
        content: "Updated Comment",
      },
      user: { uuid: user.uuid },
      params: { id: comment.id },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateComment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: comment.id,
      content: "Updated Comment",
      createdBy: user.uuid,
      epicId: epic.id,
      ticketId: ticket.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should return 404 if comment not found", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "Test User",
        password: "password",
      },
    });

    const req = {
      body: {
        content: "Updated Comment",
      },
      user: { uuid: user.uuid },
      params: { id: 999 }, // Non-existent comment ID
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });
});
