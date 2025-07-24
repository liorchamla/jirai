import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { createTeamSchema, updateTeamSchema } from "../schemas/teamsSchema";
import slug from "slug";

// ============================================================
// ====================== GET ALL TEAMS =======================
// ============================================================

export async function getAllTeams(req: Request, res: Response) {
  try {
    const teams = await prisma.team.findMany({
      orderBy: [{ updatedAt: "desc" }],
    });
    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== GET TEAM BY SLUG ======================
// ============================================================

export async function getTeamBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { slug },
      include: { creator: true }, // Include user information if needed
      omit: { createdBy: true }, // Omit createdBy if not needed in response
    });
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.status(200).json({ team });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== CREATE TEAM =========================
// ============================================================

export async function createTeam(req: Request, res: Response) {
  const result = createTeamSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(422).json({ error: result.error.format() });
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name } = result.data;
  const teamSlug = slug(name);

  try {
    const newTeam = await prisma.team.create({
      data: {
        slug: teamSlug,
        name,
        createdBy: req.user.uuid,
      },
      include: {
        creator: true, // Include user information if needed
      },
    });
    res.status(201).json({ team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== UPDATE TEAM =========================
// ============================================================

export async function updateTeam(req: Request, res: Response) {
  const { slug } = req.params;
  const result = updateTeamSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(422).json({ error: result.error.format() });
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const existingTeam = await prisma.team.findUnique({
    where: { slug },
  });
  if (!existingTeam) {
    res.status(404).json({ error: "Team not found" });
    return;
  }

  const { name } = result.data;

  try {
    const updatedTeam = await prisma.team.update({
      where: { slug },
      data: {
        name,
      },
      include: {
        creator: true, // Include user information if needed
      },
    });
    res.status(200).json({ team: updatedTeam });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== DELETE TEAM =========================
// ============================================================

export async function deleteTeam(req: Request, res: Response) {
  const { slug } = req.params;

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const existingTeam = await prisma.team.findUnique({
    where: { slug },
  });
  if (!existingTeam) {
    res.status(404).json({ error: "Team not found" });
    return;
  }

  try {
    const deletedTeam = await prisma.team.delete({
      where: { slug },
    });
    res
      .status(200)
      .json({ message: "Team deleted successfully", team: deletedTeam });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
