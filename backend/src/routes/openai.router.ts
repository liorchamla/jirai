import { Router } from "express";
import * as openaiController from "../controllers/openaiControllers";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get(
  "/epic/:id/summary",
  authenticateToken,
  openaiController.getSummaryCommentEpic
);
