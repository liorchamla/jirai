import { Router } from "express";
import { router as users } from "./user.router";
import { router as project } from "./project.router";

export const router = Router();

router.use(users);
router.use(project);
