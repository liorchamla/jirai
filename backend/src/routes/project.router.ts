import * as ProjectController from "../controllers/projectController";
import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";

export const router = Router();

router.get("/projects", authenticateToken, ProjectController.getAllProjects);
router.get(
  "/projects/:slug",
  authenticateToken,
  ProjectController.getProjectBySlug
);
router.post("/projects", authenticateToken, ProjectController.createProject);
router.patch(
  "/projects/:slug",
  authenticateToken,
  ProjectController.updateProject
);
router.delete(
  "/projects/:slug",
  authenticateToken,
  ProjectController.deleteProject
);
