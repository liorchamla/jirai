import { Router } from "express";
import * as statusController from "../controllers/statusController";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get("/status", authenticateToken, statusController.getStatus);
