import {
  createUserSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../schemas/usersSchema";
import prisma from "../utils/prisma";
import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// ============================================================
// ====================== GET ALL USERS =======================
// ============================================================

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== GET USER BY ID ======================
// ============================================================

export async function getUserById(req: Request, res: Response) {
  const { uuid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { uuid: uuid },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== CREATE USER =========================
// ============================================================

export async function createUser(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const hashedPassword = await argon2.hash(result.data.password);
  result.data.password = hashedPassword;

  const existingEmailUser = await prisma.user.findUnique({
    where: { email: result.data.email },
  });

  if (existingEmailUser) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const existingUsernameUser = await prisma.user.findFirst({
    where: { username: result.data.username },
  });

  if (existingUsernameUser) {
    res.status(400).json({ error: "Username already in use" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: result.data,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== USER LOGIN ==========================
// ============================================================

export async function userLogin(req: Request, res: Response) {
  const result = userLoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      uuid: true,
      username: true,
      email: true,
      password: true, // Include password for verification
      position: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    res.status(404).json({ error: "Invalid email or password" });
    return;
  }

  const validPassword = await argon2.verify(user.password, password);
  if (!validPassword) {
    res.status(404).json({ error: "Invalid email or password" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: "JWT secret not configured" });
    return;
  }

  try {
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== UPDATE USER =========================
// ============================================================

export async function updateUser(req: Request, res: Response) {
  const { uuid } = req.params;

  const result = userUpdateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  if (result.data.password) {
    const hashedPassword = await argon2.hash(result.data.password);
    result.data.password = hashedPassword;
  }

  if (result.data.email) {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingEmailUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
  }

  if (result.data.username) {
    const existingUsernameUser = await prisma.user.findFirst({
      where: { username: result.data.username },
    });

    if (existingUsernameUser) {
      res.status(400).json({ error: "Username already in use" });
      return;
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { uuid },
      data: result.data,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ====================== DELETE USER =========================
// ============================================================

export async function deleteUser(req: Request, res: Response) {
  const { uuid } = req.params;

  const user = await prisma.user.findUnique({
    where: { uuid },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const user = await prisma.user.delete({
      where: { uuid },
    });
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
