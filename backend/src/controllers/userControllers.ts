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
    const users = await prisma.user.findMany({
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
    });
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
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
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
    res.status(422).json({ error: result.error.errors });
    return;
  }

  const hashedPassword = await argon2.hash(result.data.password);
  result.data.password = hashedPassword;

  const existingEmailUser = await prisma.user.findUnique({
    where: { email: result.data.email },
  });

  if (existingEmailUser) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const existingUsernameUser = await prisma.user.findFirst({
    where: { username: result.data.username },
  });

  if (existingUsernameUser) {
    res.status(409).json({ error: "Username already in use" });
    return;
  }

  const { teams, ...userData } = result.data;

  try {
    // Créer l'utilisateur d'abord
    const user = await prisma.user.create({
      data: userData,
    });

    // Ensuite, créer les relations TeamMember si des équipes sont spécifiées
    if (teams && teams.length > 0) {
      // Vérifier que toutes les équipes existent
      const existingTeams = await prisma.team.findMany({
        where: {
          name: {
            in: teams.map((tm) => tm),
          },
        },
      });

      if (existingTeams.length !== teams.length) {
        // Supprimer l'utilisateur créé et retourner une erreur
        await prisma.user.delete({ where: { uuid: user.uuid } });
        res.status(400).json({
          error: "Une ou plusieurs équipes spécifiées n'existent pas",
        });
        return;
      }

      // Créer les relations TeamMember en utilisant les slugs des équipes
      await prisma.teamMember.createMany({
        data: existingTeams.map((team) => ({
          userId: user.uuid,
          teamId: team.slug,
        })),
      });
    }

    // Récupérer l'utilisateur avec ses équipes pour la réponse
    const userWithTeams = await prisma.user.findUnique({
      where: { uuid: user.uuid },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    res.status(201).json(userWithTeams);
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
    res.status(422).json({ error: result.error.errors });
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
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const validPassword = await argon2.verify(user.password, password);
  if (!validPassword) {
    res.status(401).json({ error: "Invalid email or password" });
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
    res.status(422).json({ error: result.error.errors });
    return;
  }

  if (result.data.password) {
    const hashedPassword = await argon2.hash(result.data.password);
    result.data.password = hashedPassword;
  }

  if (result.data.email) {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: result.data.email, NOT: { uuid } },
    });

    if (existingEmailUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
  }

  if (result.data.username) {
    const existingUsernameUser = await prisma.user.findFirst({
      where: { username: result.data.username, NOT: { uuid } },
    });

    if (existingUsernameUser) {
      res.status(400).json({ error: "Username already in use" });
      return;
    }
  }

  const { teams, ...updateData } = result.data;

  try {
    const updatedUser = await prisma.user.update({
      where: { uuid },
      data: updateData,
    });

    if (teams !== undefined) {
      if (teams.length > 0) {
        // Vérifier que toutes les équipes existent
        const existingTeams = await prisma.team.findMany({
          where: {
            name: {
              in: teams.map((tm) => tm),
            },
          },
        });

        if (existingTeams.length !== teams.length) {
          res.status(400).json({
            error: "Une ou plusieurs équipes spécifiées n'existent pas",
          });
          return;
        }

        // Supprimer les anciennes relations TeamMember
        await prisma.teamMember.deleteMany({
          where: { userId: updatedUser.uuid },
        });

        await prisma.teamMember.createMany({
          data: existingTeams.map((team) => ({
            userId: updatedUser.uuid,
            teamId: team.slug,
          })),
        });
      } else {
        // Tableau teams vide : supprimer toutes les relations TeamMember
        await prisma.teamMember.deleteMany({
          where: { userId: updatedUser.uuid },
        });
      }
    }

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
    await prisma.teamMember.deleteMany({
      where: { userId: uuid },
    });
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
