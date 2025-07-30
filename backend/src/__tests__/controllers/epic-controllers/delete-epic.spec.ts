import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../utils/prisma";
import { deleteEpic } from "../../../controllers/epicControllers";
import { Request, Response } from "express";

describe("deleteEpic", () => {
  beforeEach(async () => {
    // Clear the epics table before each test
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.epic.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.status.deleteMany({});
  });

  it("should delete an epic", async () => {
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

    const req = {
      params: { id: epic.id.toString() },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteEpic(req, res);

    // Verify the epic was deleted from the database
    const deletedEpic = await prisma.epic.findUnique({
      where: { id: epic.id },
    });

    expect(deletedEpic).toBeNull();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Epic deleted successfully",
      epic: expect.objectContaining({
        id: epic.id,
        title: "Epic to Delete",
        description: "Description to Delete",
        priority: "high",
      }),
    });
  });

  it("should handle deleting non-existent epic", async () => {
    const req = {
      params: { id: "999" }, // Non-existent epic ID
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await deleteEpic(req, res);

    // Prisma will throw an error if the record doesn't exist
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Epic not found" });
  });
});
