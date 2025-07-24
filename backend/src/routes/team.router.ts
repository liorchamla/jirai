import { Router } from "express";
import * as teamController from "../controllers/teamController";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get("/teams", authenticateToken, teamController.getAllTeams);
router.get("/teams/:slug", authenticateToken, teamController.getTeamBySlug);
router.post("/teams", authenticateToken, teamController.createTeam);
router.patch("/teams/:slug", authenticateToken, teamController.updateTeam);
router.delete("/teams/:slug", authenticateToken, teamController.deleteTeam);
