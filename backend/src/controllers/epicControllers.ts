import { Request, Response } from "express";
import { epicsSchema, updateEpicSchema } from "../schemas/epicsSchema";
import prisma from "../utils/prisma";

// ============================================================
// ====================== GET ALL EPICS =======================
// ============================================================

export async function getAllEpics(req: Request, res: Response) {
  try {
    const epics = await prisma.epic.findMany({
      include: { creator: true }, // Include user information if needed
      omit: { createdBy: true }, // Omit createdBy if not needed in response
      orderBy: [{ updatedAt: "desc" }],
    });
    res.status(200).json(epics);
  } catch (error) {
    console.error("Error fetching epics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== GET EPIC BY ID ======================
// ============================================================

export async function getEpicById(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    // If id is NaN (invalid), findUnique will return null
    const epic = isNaN(id)
      ? null
      : await prisma.epic.findUnique({
          where: { id },
          include: { creator: true }, // Include user information if needed
          omit: { createdBy: true }, // Omit createdBy if not needed in response
        });

    if (!epic) {
      res.status(404).json({ error: "Epic not found" });
      return;
    }
    res.status(200).json(epic);
  } catch (error) {
    console.error("Error fetching epic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== CREATE EPIC =========================
// ============================================================

export async function createEpic(req: Request, res: Response) {
  const result = epicsSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { title, description, priority, assignedTo, projectSlug } = result.data;

  try {
    const status = await prisma.status.findFirst({
      where: { name: "thinking" },
    });

    if (!status) {
      res.status(404).json({ error: "Default status not found" });
      return;
    }

    const epic = await prisma.epic.create({
      data: {
        title,
        description,
        priority,
        assignedTo,
        projectSlug,
        createdBy: req.user.uuid,
        statusId: status.id, // Use the found status ID
      },
    });
    res.status(201).json(epic);
  } catch (error) {
    console.error("Error creating epic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== UPDATE EPIC =========================
// ============================================================

export async function updateEpic(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = updateEpicSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { title, description, priority, createdBy, assignedTo, projectSlug } =
    result.data;

  try {
    const existingEpic = await prisma.epic.findUnique({
      where: { id },
    });
    if (!existingEpic) {
      res.status(404).json({ error: "Epic not found" });
      return;
    }

    const epic = await prisma.epic.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        createdBy,
        assignedTo,
        projectSlug,
      },
    });
    res.status(200).json(epic);
  } catch (error) {
    console.error("Error updating epic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== DELETE EPIC =========================
// ============================================================

export async function deleteEpic(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const existingEpic = await prisma.epic.findUnique({
      where: { id },
    });
    if (!existingEpic) {
      res.status(404).json({ error: "Epic not found" });
      return;
    }

    const epic = await prisma.epic.delete({
      where: { id },
    });
    res.status(200).json({ message: "Epic deleted successfully", epic });
  } catch (error) {
    console.error("Error deleting epic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
