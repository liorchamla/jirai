import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Étendre l'interface Request pour inclure la propriété 'user'
import { JwtPayload } from "jsonwebtoken";

// Déclaration de module pour étendre l'interface Request d'Express
// Cela permet d'ajouter la propriété 'user' à l'objet Request
// qui contiendra les informations de l'utilisateur décodées du token JWT.
declare module "express" {
  interface Request {
    user?: string | JwtPayload;
  }
}

/**
 * Middleware pour authentifier les requêtes avec un token JWT.
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // On récupère l'en-tête Authorization de la requête
  const authHeader = req.headers.authorization;

  // Vérifie si l'en-tête est présent et commence par "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  // On extrait le token de l'en-tête
  const token = authHeader.split(" ")[1];

  try {
    // On vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // On attache les infos à la requête
    req.user = decoded;
    // On passe au middleware suivant
    next();
  } catch {
    // Si le token est invalide ou expiré, on renvoie une erreur
    res.status(403).json({ error: "Invalid or expired token" });
  }
}
