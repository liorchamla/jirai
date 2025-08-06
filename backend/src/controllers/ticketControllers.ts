import { Request, Response } from "express";
import { ticketsSchema, updateTicketSchema } from "../schemas/ticketsSchemas";
import prisma from "../utils/prisma";
import { findStatusByName, isValidId } from "../utils/validation";

// ============================================================
// ====================== GET ALL TICKETS =====================
// ============================================================

export async function getAllTickets(req: Request, res: Response) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { creator: true, status: true }, // Include user information if needed
      omit: { createdBy: true }, // Omit createdBy if not needed in response
      orderBy: [{ updatedAt: "desc" }],
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== GET TICKET BY ID ======================
// ============================================================

export async function getTicketById(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    // If id is invalid, findUnique will return null
    const ticket = !isValidId(id)
      ? null
      : await prisma.ticket.findUnique({
          where: { id },
          include: { creator: true, status: true }, // Include user information if needed
          omit: { createdBy: true }, // Omit createdBy if not needed in response
        });

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== CREATE TICKET =========================
// ============================================================

export async function createTicket(req: Request, res: Response) {
  const result = ticketsSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { title, description, priority, assignedTo, epicId } = result.data;

  try {
    const DEFAULT_STATUS_NAME = "thinking";
    const status = await prisma.status.findFirst({
      where: { name: DEFAULT_STATUS_NAME },
    });

    if (!status) {
      res.status(404).json({ error: "Default status not found" });
      return;
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        assignedTo,
        epicId,
        createdBy: req.user.uuid,
        statusId: status.id, // Use the found status ID
      },
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== UPDATE TICKET =========================
// ============================================================

export async function updateTicket(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = updateTicketSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { title, description, priority, assignedTo, epicId } = result.data;

  try {
    const DEFAULT_STATUS_NAME = result.data.status;
    const foundStatus = DEFAULT_STATUS_NAME
      ? await findStatusByName(DEFAULT_STATUS_NAME)
      : null;

    const statusId = foundStatus?.id;

    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!existingTicket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        assignedTo,
        epicId,
        statusId,
      },
    });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== DELETE TICKET =========================
// ============================================================

export async function deleteTicket(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!existingTicket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const ticket = await prisma.ticket.delete({
      where: { id },
    });
    res.status(200).json({ message: "Ticket deleted successfully", ticket });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
