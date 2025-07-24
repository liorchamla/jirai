import * as projectController from "../controllers/projectController";
import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";

export const router = Router();

router.get("/projects", authenticateToken, projectController.getAllProjects);
router.get(
  "/projects/:slug",
  authenticateToken,
  projectController.getProjectBySlug
);
router.post("/projects", authenticateToken, projectController.createProject);
router.patch(
  "/projects/:slug",
  authenticateToken,
  projectController.updateProject
);
router.delete(
  "/projects/:slug",
  authenticateToken,
  projectController.deleteProject
);
