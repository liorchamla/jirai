import {
  createUserSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../schemas/usersSchema";
import type { ZodSchema } from "zod";
import prisma from "../utils/prisma";
import { hashPassword, verifyPassword } from "../utils/password-hash";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Récupère la liste de tous les utilisateurs, avec leurs équipes associées.
 *
 * Cette méthode retourne tous les utilisateurs présents en base, triés par date de mise à jour décroissante.
 * Les équipes associées à chaque utilisateur sont incluses dans la réponse.
 *
 *
 * Réponses possibles :
 *   - 200 : Liste des utilisateurs récupérée avec succès
 *   - 500 : Erreur interne du serveur
 *
 * @param {Request} req - Objet Express de la requête HTTP
 * @param {Response} res - Objet Express pour envoyer la réponse HTTP
 * @returns {Promise<void>} Rien (réponse envoyée via res)
 */
export async function getAllUsers(req: Request, res: Response) {
  try {
    // Récupérer tous les utilisateurs avec leurs équipes associées
    // et trier par date de mise à jour décroissante
    const users = await prisma.user.findMany({
      include: {
        teams: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    // Envoyer la liste des utilisateurs en réponse
    res.status(200).json({ users });
  } catch (error) {
    // En cas d'erreur lors de la récupération des utilisateurs, on renvoie une erreur 500
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Récupère un utilisateur par son UUID, avec ses équipes associées.
 *
 * Cette méthode permet d'obtenir les informations d'un utilisateur à partir de son identifiant unique (UUID).
 * Les équipes associées à l'utilisateur sont incluses dans la réponse.
 *
 *
 *
 * Réponses possibles :
 *   - 200 : Utilisateur trouvé (avec ses équipes)
 *   - 404 : Utilisateur non trouvé
 *   - 500 : Erreur interne du serveur
 *
 * @param {Request} req - Objet Express contenant le paramètre uuid
 * @param {Response} res - Objet Express pour envoyer la réponse HTTP
 * @returns {Promise<void>} Rien (réponse envoyée via res)
 */
export async function getUserById(req: Request, res: Response) {
  // On récupère l'UUID de l'utilisateur à partir des paramètres de la requête
  // (par exemple, /users/:uuid)
  const { uuid } = req.params;

  try {
    // On cherche l'utilisateur par son UUID
    const user = await prisma.user.findUnique({
      where: { uuid: uuid },
      include: {
        teams: true,
      },
    });

    // Si l'utilisateur n'existe pas, on renvoie une erreur 404
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Si l'utilisateur est trouvé, on renvoie ses informations
    res.status(200).json(user);
  } catch (error) {
    // En cas d'erreur lors de la récupération de l'utilisateur, on renvoie une erreur 500
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Crée un nouvel utilisateur dans la base de données.
 *
 * Cette méthode valide les données reçues, vérifie l'unicité de l'email et du nom d'utilisateur,
 * hash le mot de passe, et associe éventuellement l'utilisateur à des équipes existantes.
 *
 * Exemples de payload pour la requête :
 * ```json
 * {
 *   "email": "john@doe.com",
 *   "username": "johndoe",
 *   "password": "motdepasse",
 *   "teams": ["team1", "team2"]
 * }
 * ```
 * Ou sans équipes :
 * ```json
 * {
 *   "email": "john@doe.com",
 *   "username": "johndoe",
 *   "password": "motdepasse"
 * }
 * ```
 *
 * Réponses possibles :
 *   - 201 : Utilisateur créé avec succès (retourne l'utilisateur et ses équipes)
 *   - 400 : Une ou plusieurs équipes n'existent pas
 *   - 409 : Email ou nom d'utilisateur déjà utilisé
 *   - 422 : Erreur de validation du schéma
 *   - 500 : Erreur interne du serveur
 *
 * @param {Request} req - Objet Express contenant le corps de la requête (données utilisateur)
 * @param {Response} res - Objet Express pour envoyer la réponse HTTP
 * @returns {Promise<void>} Rien (réponse envoyée via res)
 */
export async function createUser(req: Request, res: Response) {
  // Validation du schéma
  const validatedUserData = validateSchema(createUserSchema, req.body, res);
  if (!validatedUserData) return;

  // On vérifie l'unicité de l'email et du nom d'utilisateur
  // Si l'email est déjà pris, on renvoie une erreur 409
  if (await isEmailTaken(validatedUserData.email)) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  // Si le username est déjà pris, on renvoie une erreur 409
  if (await isUsernameTaken(validatedUserData.username)) {
    res.status(409).json({ error: "Username already in use" });
    return;
  }

  // On récupère d'un côté les équipes à associer (par défaut si on n'en a pas, on met un tableau vide)
  // et de l'autre les données utilisateur à stocker
  const { teams = [], ...userData } = validatedUserData;

  try {
    // Vérification de l'existence des équipes si besoin
    const allTeamsExist = await assertTeamsExist(teams, res);
    if (!allTeamsExist) return;

    // Liste des équipes à connecter
    const teamsToConnect = teams.map((team) => ({ slug: team }));

    // On hash le mot de passe utilisateur avant de le stocker
    userData.password = await hashPassword(userData.password);

    // Créer l'utilisateur et récupérer le résultat en incluant les équipes
    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        teams: {
          connect: teamsToConnect,
        },
      },
      include: {
        teams: true, // Inclure les équipes associées
      },
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Authentifie un utilisateur à partir de son email et mot de passe.
 *
 * Cette méthode vérifie les identifiants fournis dans le corps de la requête (email et mot de passe).
 * Si l'utilisateur existe et que le mot de passe est correct, un token JWT est généré et renvoyé.
 *
 * Exemples de payload pour la requête :
 * ```json
 * {
 *   "email": "john@doe.com",
 *   "password": "motdepasse"
 * }
 * ```
 *
 * Réponses possibles :
 *   - 200 : Authentification réussie, token JWT renvoyé
 *   - 401 : Email ou mot de passe invalide
 *   - 422 : Erreur de validation du schéma
 *   - 500 : Erreur interne du serveur ou secret JWT manquant
 *
 * @param {Request} req - Objet Express contenant le corps de la requête (email, password)
 * @param {Response} res - Objet Express pour envoyer la réponse HTTP
 * @returns {Promise<void>} Rien (réponse envoyée via res)
 */
export async function userLogin(req: Request, res: Response) {
  // Validation du schéma
  const validatedUserLoginData = validateSchema(userLoginSchema, req.body, res);
  if (!validatedUserLoginData) return;

  // On récupère les données validées qui nous intéressent
  const { email, password } = validatedUserLoginData;

  // On cherche l'utilisateur par son email
  // On inclut le mot de passe pour la vérification
  // (attention, ne pas renvoyer le mot de passe dans la réponse)
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      uuid: true,
      username: true,
      email: true,
      password: true, // Include password for verification
    },
  });

  // Si l'utilisateur n'existe pas, on renvoie une erreur 401
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // On vérifie que le mot de passe fourni correspond au hash stocké
  const validPassword = await verifyPassword(user.password, password);
  // Si le mot de passe est incorrect, on renvoie une erreur 401
  if (!validPassword) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Si on ne peut pas générer de token JWT, on renvoie une erreur 500
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: "JWT secret not configured" });
    return;
  }

  try {
    // On génère un token JWT avec les informations de l'utilisateur
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // On renvoie le token dans la réponse
    res.status(200).json({
      token,
    });
  } catch (error) {
    // En cas d'erreur lors de la génération du token, on renvoie une erreur 500
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Met à jour les informations d'un utilisateur existant.
 *
 * Cette méthode permet de modifier les informations d'un utilisateur identifié par son UUID.
 * Elle prend en charge la mise à jour du mot de passe (avec hashage), de l'email, du nom d'utilisateur,
 * ainsi que l'association aux équipes (teams). Les validations suivantes sont effectuées :
 *   - Validation du schéma de données (Zod)
 *   - Unicité de l'email et du nom d'utilisateur (hors utilisateur courant)
 *   - Existence des équipes à associer
 *
 * Si des équipes sont fournies, toutes les relations existantes sont supprimées puis remplacées par les nouvelles.
 *
 * Exemples de payload pour la requête :
 * ```
 * {
 *  "email": "john@doe.com",
 *  "username": "johndoe",
 *  "password": "newpassword",
 *  "teams": ["team1", "team2"]
 * }
 * ```
 * Ou alors sans équipes :
 * ```
 * {
 *  "email": "john@doe.com",
 *  "username": "johndoe",
 *  "password": "newpassword"
 * }
 * ```
 *
 * Réponses possibles :
 *   - 200 : Utilisateur mis à jour avec succès
 *   - 400 : Email ou nom d'utilisateur déjà utilisé, ou équipe inexistante
 *   - 404 : Utilisateur non trouvé
 *   - 422 : Erreur de validation du schéma
 *   - 500 : Erreur interne du serveur
 *
 * @param {Request} req - Objet Express contenant les paramètres (uuid) et le corps de la requête (données à mettre à jour)
 * @param {Response} res - Objet Express pour envoyer la réponse HTTP
 * @returns {Promise<void>} Rien (réponse envoyée via res)
 */
export async function updateUser(req: Request, res: Response) {
  const { uuid } = req.params;

  // Validation du schéma
  const validatedUserData = validateSchema(userUpdateSchema, req.body, res);
  if (!validatedUserData) return;

  // Vérification de l'unicité de l'email
  if (validatedUserData.email) {
    // Si l'email est déjà pris par un autre utilisateur, on renvoie une erreur 400
    if (await isEmailTaken(validatedUserData.email, uuid)) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
  }

  // Vérification de l'unicité du nom d'utilisateur
  if (validatedUserData.username) {
    // Si le nom d'utilisateur est déjà pris par un autre utilisateur, on renvoie une erreur 400
    if (await isUsernameTaken(validatedUserData.username, uuid)) {
      res.status(400).json({ error: "Username already in use" });
      return;
    }
  }

  // Maintenant on prend dans les données validées d'un côté les équipes (tableau vide si elles ne sont pas données)
  const { teams = [], ...updateData } = validatedUserData;

  // Vérification de l'existence des équipes
  const allTeamsExist = await assertTeamsExist(teams, res);
  if (!allTeamsExist) return;

  try {
    // Si un nouveau mot de passe est fourni, on le hash avant de le stocker
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // On update le user en remettant ses équipes à 0 avant de connecter les nouvelles
    // Et on récupère l'utilisateur mis à jour avec ses équipes (d'où l'include des teams)
    const updatedUser = await prisma.user.update({
      where: { uuid },
      data: {
        ...updateData,
        teams: {
          set: [], // Supprimer toutes les relations existantes
          connect: teams.map((team) => ({ slug: team })), // Connecter les nouvelles équipes
        },
      },
      include: {
        teams: true, // Inclure les équipes associées
      },
    });

    // On renvoie l'utilisateur mis à jour dans la réponse
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    // En cas d'erreur lors de la mise à jour de l'utilisateur, on renvoie une erreur 500
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Supprime un utilisateur à partir de son UUID.
 *
 * Cette méthode supprime un utilisateur identifié par son UUID, après avoir vérifié son existence.
 *
 * Réponses possibles:
 *   - 200: Utilisateur supprimé avec succès (retourne l'utilisateur supprimé)
 *   - 404: Utilisateur non trouvé
 *   - 500: Erreur interne du serveur
 *
 */
export async function deleteUser(req: Request, res: Response) {
  // On récupère l'UUID de l'utilisateur à partir des paramètres de la requête
  // (par exemple, /users/:uuid)
  const { uuid } = req.params;

  // On vérifie que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { uuid },
  });

  // Si l'utilisateur n'existe pas, on renvoie une erreur 404
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    // On supprime l'utilisateur
    await prisma.user.delete({
      where: { uuid },
    });

    // On renvoie l'utilisateur supprimé dans la réponse
    res.status(204).send(); // 204 No Content, car on ne renvoie pas de corps
  } catch (error) {
    // En cas d'erreur lors de la suppression de l'utilisateur, on renvoie une
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Vérifie si un email est déjà utilisé par un autre utilisateur dans la base.
 *
 * @param {string} email - L'email à vérifier.
 * @param {string} [excludeUuid] - (Optionnel) UUID d'un utilisateur à exclure de la recherche (utile lors d'une mise à jour).
 * @returns {Promise<boolean>} Retourne true si l'email est déjà pris par un autre utilisateur, sinon false.
 *
 * @example
 *   await isEmailTaken('test@example.com'); // true ou false
 *   await isEmailTaken('test@example.com', 'uuid-à-exclure'); // true ou false
 */
export async function isEmailTaken(
  email: string,
  excludeUuid?: string
): Promise<boolean> {
  // Si on fournit un UUID à exclure (cas d'une mise à jour),
  // on cherche un utilisateur qui a le même email mais un UUID différent
  if (excludeUuid) {
    // Recherche d'un utilisateur avec cet email, mais qui n'a PAS l'UUID à exclure
    const user = await prisma.user.findFirst({
      where: { email, uuid: { not: excludeUuid } },
    });

    // Si un utilisateur est trouvé, l'email est déjà pris
    return !!user;
  }

  // Sinon, on cherche simplement un utilisateur avec cet email
  const user = await prisma.user.findUnique({ where: { email } });

  // Si un utilisateur est trouvé, l'email est déjà pris
  return !!user;
}

/**
 * Vérifie si un nom d'utilisateur est déjà utilisé par un autre utilisateur dans la base.
 *
 * @param {string} username - Le nom d'utilisateur à vérifier.
 * @param {string} [excludeUuid] - (Optionnel) UUID d'un utilisateur à exclure de la recherche (utile lors d'une mise à jour).
 * @returns {Promise<boolean>} Retourne true si le nom d'utilisateur est déjà pris par un autre utilisateur, sinon false.
 *
 * @example
 *   await isUsernameTaken('john'); // true ou false
 *   await isUsernameTaken('john', 'uuid-à-exclure'); // true ou false
 */
export async function isUsernameTaken(
  username: string,
  excludeUuid?: string
): Promise<boolean> {
  // Si on fournit un UUID à exclure (cas d'une mise à jour),
  // on cherche un utilisateur qui a le même username mais un UUID différent
  if (excludeUuid) {
    // Recherche d'un utilisateur avec ce username, mais qui n'a PAS l'UUID à exclure
    const user = await prisma.user.findFirst({
      where: { username, uuid: { not: excludeUuid } },
    });

    // Si un utilisateur est trouvé, le username est déjà pris
    return !!user;
  }

  // Sinon, on cherche simplement un utilisateur avec ce username
  const user = await prisma.user.findFirst({ where: { username } });

  // Si un utilisateur est trouvé, le username est déjà pris
  return !!user;
}

/**
 * Valide les données reçues via un schéma Zod et gère la réponse 422 en cas d'erreur.
 * @param schema Le schéma Zod à utiliser pour la validation
 * @param data Les données à valider (ex: req.body)
 * @param res L'objet Response Express pour envoyer la réponse en cas d'erreur
 * @returns Les données validées si succès, sinon undefined (et la réponse est déjà envoyée)
 */
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
  res: Response
): T | undefined {
  const result = schema.safeParse(data);

  // Si la validation échoue, on envoie une réponse 422 avec les erreurs
  if (!result.success) {
    res.status(422).json({ error: result.error.errors });
    return;
  }

  // Si la validation réussit, on retourne les données validées
  return result.data;
}

/**
 * Vérifie que toutes les équipes (slugs) existent en base.
 * Si une équipe n'existe pas, envoie une réponse 400 et retourne false.
 * Sinon, retourne true.
 *
 * @param {string[]} teamSlugs - Liste des slugs d'équipes à vérifier.
 * @param {Response} res - L'objet Response Express pour envoyer la réponse en cas d'erreur.
 * @returns {Promise<boolean>} true si toutes les équipes existent, false sinon (et la réponse est envoyée).
 *
 * @example
 *   if (!(await assertTeamsExist(["dev", "ops"], res))) return;
 */
export async function assertTeamsExist(
  teamSlugs: string[],
  res: Response
): Promise<boolean> {
  for (const slug of teamSlugs) {
    // On vérifie l'existence de chaque équipe individuellement
    const team = await prisma.team.findUnique({ where: { slug } });
    if (!team) {
      // Si une équipe n'existe pas, on répond 400 et on arrête la suite
      res.status(400).json({ error: `Team with slug ${slug} does not exist` });
      return false;
    }
  }
  // Toutes les équipes existent
  return true;
}
