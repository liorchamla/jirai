import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { getAllTickets } from "../../../controllers/ticketControllers";
import type { Request, Response } from "express";

describe("getAllTickets", () => {
  beforeEach(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
  });

  it("should return all tickets", async () => {
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
        title: "Epic 1",
        description: "Description 1",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    await prisma.ticket.createManyAndReturn({
      data: [
        {
          title: "Ticket 1",
          description: "Description 1",
          priority: "high",
          epicId: epic.id,
          createdBy: user.uuid,
          statusId: 1,
        },
        {
          title: "Ticket 2",
          description: "Description 2",
          priority: "medium",
          epicId: epic.id,
          createdBy: user.uuid,
          statusId: 1,
        },
      ],
    });

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllTickets(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Ticket 1",
          description: "Description 1",
          priority: "high",
          creator: expect.objectContaining({
            email: "user1@example.com",
            username: "user1",
          }),
        }),
        expect.objectContaining({
          title: "Ticket 2",
          description: "Description 2",
          priority: "medium",
        }),
      ])
    );
  });

  it("should return empty array when no tickets exist", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllTickets(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
