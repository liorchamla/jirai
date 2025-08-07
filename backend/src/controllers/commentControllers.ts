import { Request, Response } from "express";
import prisma from "../utils/prisma";
import {
  commentsSchema,
  updateCommentsSchema,
} from "../schemas/commentsSchema";

// ============================================================
// ====================== GET ALL COMMENTS ====================
// ============================================================

export async function getAllComments(req: Request, res: Response) {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        creator: true, // Include user information for the comment creator
        epic: true, // Include epic information if the comment is related to an epic
        ticket: true, // Include ticket information if the comment is related to a ticket
      },
      orderBy: [{ createdAt: "desc" }],
    });
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== GET COMMENT BY ID ===================
// ============================================================

export async function getCommentById(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        creator: true, // Include user information for the comment creator
        epic: true, // Include epic information if the comment is related to an epic
        ticket: true, // Include ticket information if the comment is related to a ticket
      },
    });

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== CREATE COMMENT ======================
// ============================================================

export async function createComment(req: Request, res: Response) {
  const result = commentsSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(422)
      .json({ error: "Invalid comment data", issues: result.error.issues });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  const { content, epicId, ticketId } = result.data;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        epicId,
        ticketId,
        createdBy: req.user.uuid,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== UPDATE COMMENT ======================
// ============================================================

export async function updateComment(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = updateCommentsSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(422)
      .json({ error: "Invalid comment data", issues: result.error.issues });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  const { content } = result.data;

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== DELETE COMMENT ======================
// ============================================================

export async function deleteComment(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!req.user) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    // Check if the user is the creator of the comment
    if (comment.createdBy !== req.user.uuid) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
