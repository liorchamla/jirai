import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getAllComments } from "../../../controllers/commentControllers";
import { Request, Response } from "express";
import { cleanDatabase } from "../../utils/test-db-utils";

describe("getAllComments", () => {
  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await cleanDatabase();
  });

  it("should return all comments", async () => {
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

    await prisma.comment.createMany({
      data: [
        {
          content: "First comment",
          createdBy: user.uuid,
          epicId: epic.id,
        },
        {
          content: "Second comment",
          createdBy: user.uuid,
          ticketId: ticket.id,
        },
      ],
    });
    const req = {
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllComments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: "First comment", epicId: epic.id }),
        expect.objectContaining({
          content: "Second comment",
          ticketId: ticket.id,
        }),
      ]),
    });
  });

  it("should return an empty array if no comments exist", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllComments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ comments: [] });
  });
});
