import { Router } from "express";
import * as openaiController from "../controllers/openaiControllers";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get(
  "/epic/:id/summary",
  authenticateToken,
  openaiController.getSummaryCommentEpic
);
router.get(
  "/ticket/:id/summary",
  authenticateToken,
  openaiController.getSummaryCommentTicket
);
router.post(
  "/automation/:projectSlug/epic",
  authenticateToken,
  openaiController.getDescriptionNewEpic
);
router.post(
  "/automation/:epicId/ticket",
  authenticateToken,
  openaiController.getDescriptionNewTicket
);
