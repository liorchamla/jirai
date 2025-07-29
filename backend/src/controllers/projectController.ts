import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projectsSchema";
import prisma from "../utils/prisma";
import { Request, Response } from "express";
import slug from "slug";

// ============================================================
// ====================== GET ALL PROJECTS =====================
// ============================================================

export async function getAllProjects(req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      include: { creator: true, teams: true }, // Include user information if needed
      omit: { createdBy: true }, // Omit createdBy if not needed in response
      orderBy: [{ updatedAt: "desc" }],
    });
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== GET PROJECT BY SLUG ==================
// ============================================================

export async function getProjectBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { creator: true, teams: true }, // Include user information if needed
      omit: { createdBy: true }, // Omit createdBy if not needed in response
    });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== CREATE PROJECT =======================
// ============================================================

export async function createProject(req: Request, res: Response) {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { teams = [], ...userData } = result.data;

  const projectSlug = slug(userData.name);

  try {
    const teamsToConnect = teams.map((team) => ({ slug: team }));

    const newProject = await prisma.project.create({
      data: {
        slug: projectSlug,
        name: userData.name,
        description: userData.description,
        createdBy: req.user.uuid, // Assuming req.user is set by authentication middleware
        status: userData.status || "active", // Default status
        teams: {
          connect: teamsToConnect,
        },
      },
      include: {
        creator: true, // Include user information if needed
      },
    });
    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== UPDATE PROJECT =======================
// ============================================================

export async function updateProject(req: Request, res: Response) {
  const { slug } = req.params;
  const result = updateProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({ error: result.error });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!slug) {
    res.status(400).json({ error: "Project slug is required" });
    return;
  }

  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });
  if (!existingProject) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const { teams = [], ...userData } = result.data;
  const teamsToConnect = teams.map((team) => ({ slug: team }));

  try {
    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        name: userData.name,
        description: userData.description,
        status: userData.status,
        teams: {
          set: [], // Supprimer toutes les relations existantes
          connect: teamsToConnect,
        },
      },
      include: {
        creator: true,
      },
    });
    res.status(200).json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================
// ====================== DELETE PROJECT =======================
// ============================================================

export async function deleteProject(req: Request, res: Response) {
  const { slug } = req.params;

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!slug) {
    res.status(400).json({ error: "Project slug is required" });
    return;
  }

  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });
  if (!existingProject) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  try {
    const deletedProject = await prisma.project.delete({
      where: { slug },
    });
    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
