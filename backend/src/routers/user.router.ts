import * as userControllers from "../controllers/userControllers";
import { authenticateToken } from "../../middlewares/auth";
import { Router } from "express";

export const router = Router();

router.get("/users", authenticateToken, userControllers.getAllUsers);
router.get("/users/:uuid", authenticateToken, userControllers.getUserById);
router.post("/users", authenticateToken, userControllers.createUser);
router.post("/login", userControllers.userLogin);
router.patch("/users/:uuid", authenticateToken, userControllers.updateUser);
router.delete("/users/:uuid", authenticateToken, userControllers.deleteUser);
