import argon2 from "argon2";

/**
 * Hash un mot de passe en utilisant Argon2.
 * @param {string} password - Le mot de passe en clair à hasher.
 * @returns {Promise<string>} Le hash du mot de passe.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

/**
 * Vérifie si un mot de passe correspond à un hash Argon2.
 * @param {string} hash - Le hash du mot de passe.
 * @param {string} password - Le mot de passe en clair à vérifier.
 * @returns {Promise<boolean>} true si le mot de passe correspond au hash, sinon false.
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}
