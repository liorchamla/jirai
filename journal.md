# Journal de création du projet Jirai

## 1. Initialisation du monorepo

- Création du dossier principal et initialisation avec pnpm workspace.
- Ajout des dossiers `frontend` (React + Vite) et `backend` (Express + TypeScript).
- Configuration des workspaces dans `pnpm-workspace.yaml`.
- Ajout des fichiers de base : `.gitignore`, `README.md`, etc.

## 2. Mise en place du frontend

- Création d'une app React avec Vite et TypeScript.
- Installation et configuration d'ESLint et Prettier.
- Suppression de `.eslintrc.json` au profit de `eslint.config.js` (flat config).
- Ajout des scripts de développement et build dans le `package.json` du frontend.

## 3. Mise en place du backend

- Création d'une app Express avec TypeScript.
- Configuration de TypeScript pour compiler dans `dist/`.
- Ajout d'ESLint (flat config) et Prettier pour le backend.
- Ajout des scripts de développement, build et lint dans le `package.json` du backend.

## 4. Intégration de Prisma et PostgreSQL

- Installation de `prisma` et `@prisma/client` dans le backend.
- Initialisation de Prisma (`npx prisma init`) et création du modèle `User`.
- Configuration de la connexion à PostgreSQL via `.env`.
- Migration de la base et génération du client Prisma.
- Création d'un fichier `docker-compose.yml` à la racine pour PostgreSQL.
- Configuration des variables d'environnement pour correspondre au conteneur.
- Documentation pour lancer la base avec Docker (`docker compose up -d`).
