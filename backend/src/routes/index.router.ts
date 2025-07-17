import { Router } from "express";
import { router as users } from "./user.router";

export const router = Router();

router.use(users);
