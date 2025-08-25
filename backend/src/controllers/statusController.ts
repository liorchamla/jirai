import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getStatus(req: Request, res: Response) {
  try {
    const status = await prisma.status.findMany();
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
