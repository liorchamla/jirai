import { Router } from "express";
import * as epicController from "../controllers/epicControllers";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get("/epics", authenticateToken, epicController.getAllEpics);
router.get("/epics/:id", authenticateToken, epicController.getEpicById);
router.post("/epics", authenticateToken, epicController.createEpic);
router.patch("/epics/:id", authenticateToken, epicController.updateEpic);
router.delete("/epics/:id", authenticateToken, epicController.deleteEpic);
