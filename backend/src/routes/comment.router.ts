import { Router } from "express";
import * as commentControllers from "../controllers/commentControllers";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get("/comments", authenticateToken, commentControllers.getAllComments);
router.get(
  "/comments/:id",
  authenticateToken,
  commentControllers.getCommentById
);
router.post("/comments", authenticateToken, commentControllers.createComment);
router.patch(
  "/comments/:id",
  authenticateToken,
  commentControllers.updateComment
);
router.delete(
  "/comments/:id",
  authenticateToken,
  commentControllers.deleteComment
);
