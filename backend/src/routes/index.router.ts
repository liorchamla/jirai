import { Router } from "express";
import { router as users } from "./user.router";
import { router as project } from "./project.router";
import { router as team } from "./team.router";
import { router as epic } from "./epic.router";

export const router = Router();

router.use(users);
router.use(project);
router.use(team);
router.use(epic);
