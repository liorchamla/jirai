import { Router } from "express";
import * as ticketController from "../controllers/ticketControllers";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

router.get("/tickets", authenticateToken, ticketController.getAllTickets);
router.get("/tickets/:id", authenticateToken, ticketController.getTicketById);
router.post("/tickets", authenticateToken, ticketController.createTicket);
router.patch("/tickets/:id", authenticateToken, ticketController.updateTicket);
// router.delete("/tickets/:id", authenticateToken, ticketController.deleteTicket);
