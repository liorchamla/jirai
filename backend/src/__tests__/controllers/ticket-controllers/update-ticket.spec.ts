import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { updateTicket } from "../../../controllers/ticketControllers";
import { Request, Response } from "express";

describe("updateTicket", () => {
  beforeEach(async () => {
    // Clear the tickets table before each test
    await prisma.ticket.deleteMany({});
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.ticket.deleteMany({});
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
  });

  it("should update a ticket", async () => {
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

    const epic = await prisma.epic.create({
      data: {
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        title: "Original Ticket",
        description: "Original Description",
        priority: "low",
        epicId: epic.id,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: ticket.id.toString() },
      body: {
        title: "Updated Ticket",
        description: "Updated Description",
        priority: "high",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateTicket(req, res);

    const updatedTicket = await prisma.ticket.findUnique({
      where: { id: ticket.id },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTicket);
  });

  it("should update only provided fields (partial update)", async () => {
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
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        title: "Original Ticket",
        description: "Original Description",
        priority: "low",
        epicId: epic.id,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: ticket.id.toString() },
      body: {
        title: "Updated Title Only",
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateTicket(req, res);

    const updatedTicket = await prisma.ticket.findUnique({
      where: { id: ticket.id },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(updatedTicket?.title).toBe("Updated Title Only");
  });

  it("should return 422 if data is invalid", async () => {
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
        title: "Original Epic",
        description: "Original Description",
        priority: "low",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        title: "Original Ticket",
        description: "Original Description",
        priority: "low",
        epicId: epic.id,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: ticket.id.toString() },
      body: {
        priority: "invalid", // Invalid priority
      },
      user: { uuid: user.uuid }, // Simulate authenticated user
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await updateTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: expect.any(String) }),
        ]),
      }),
    });
  });
});
