import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getTicketById } from "../../../controllers/ticketControllers";
import type { Request, Response } from "express";

describe("getTicketById", () => {
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

  it("should return ticket by id", async () => {
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

    const ticket = await prisma.ticket.create({
      data: {
        title: "Test Ticket",
        description: "Test Description",
        priority: "high",
        epicId: epic.id,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const req = {
      params: { id: ticket.id.toString() },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getTicketById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: ticket.id,
        title: "Test Ticket",
        description: "Test Description",
        priority: "high",
        creator: expect.objectContaining({
          email: "user1@example.com",
          username: "user1",
        }),
      })
    );
  });

  it("should return 404 if ticket not found", async () => {
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

    const status = await prisma.status.create({
      data: {
        id: 1,
        name: "thinking",
      },
    });

    const epic = await prisma.epic.create({
      data: {
        title: "Test Epic",
        description: "Test Description",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: status.id,
      },
    });

    await prisma.ticket.create({
      data: {
        title: "Test Ticket",
        description: "Test Description",
        priority: "high",
        epicId: epic.id,
        createdBy: user.uuid,
        statusId: status.id,
      },
    });

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getTicketById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Ticket not found" });
  });

  it("should handle invalid id parameter", async () => {
    const req = {
      params: { id: "invalid" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getTicketById(req, res);

    // Invalid id will be converted to NaN, which won't find any ticket
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Ticket not found" });
  });
});
