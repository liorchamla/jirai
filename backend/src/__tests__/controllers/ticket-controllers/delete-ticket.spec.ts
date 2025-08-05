import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { deleteTicket } from "../../../controllers/ticketControllers";
import { Request, Response } from "express";

describe("deleteTicket", () => {
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

  it("should delete a ticket", async () => {
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
        title: "Epic to Delete",
        description: "Description to Delete",
        priority: "high",
        projectSlug: project.slug,
        createdBy: user.uuid,
        statusId: 1,
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        title: "Ticket to Delete",
        description: "Description to Delete",
        priority: "medium",
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

    await deleteTicket(req, res);

    // Verify the ticket was deleted from the database
    const deletedTicket = await prisma.ticket.findUnique({
      where: { id: ticket.id },
    });

    expect(deletedTicket).toBeNull();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ticket deleted successfully",
      ticket: expect.objectContaining({
        id: ticket.id,
        title: "Ticket to Delete",
        description: "Description to Delete",
        priority: "medium",
      }),
    });
  });

  it("should handle deleting non-existent ticket", async () => {
    const req = {
      params: { id: "999" }, // Non-existent ticket ID
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteTicket(req, res);

    // Prisma will throw an error if the record doesn't exist
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Ticket not found" });
  });
});
