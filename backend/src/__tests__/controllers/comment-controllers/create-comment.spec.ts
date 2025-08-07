import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanDatabase } from "../../utils/test-db-utils";
import prisma from "../../../utils/prisma";
import { createComment } from "../../../controllers/commentControllers";
import { Request, Response } from "express";

describe("createComment", () => {
  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await cleanDatabase();
  });

  it("should create a comment", async () => {
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

    const req = {
      body: {
        content: "Test Comment",
        epicId: epic.id,
      },
      user: { uuid: user.uuid },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createComment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: expect.any(Number),
      content: "Test Comment",
      createdBy: user.uuid,
      epicId: epic.id,
      ticketId: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should return 400 for invalid comment data", async () => {
    const req = {
      body: {
        content: "", // Invalid content
      },
      user: { uuid: "test-user-uuid" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createComment(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid comment data",
      issues: expect.any(Array),
    });
  });
});
