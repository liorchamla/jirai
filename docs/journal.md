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

## 5. Mise en place du CI avec GitHub Actions

- Création du workflow CI dans `.github/workflows/ci.yml`.
- Configuration du déclenchement automatique sur les pushs vers `main` et les pull requests.
- Mise en place des étapes suivantes dans le pipeline :
  - Installation des dépendances avec cache pnpm optimisé
  - Exécution du formatage automatique (`pnpm format`)
  - Vérification que le code est correctement formaté (fail si non formaté)
  - Lancement du linter (`pnpm lint`) pour s'assurer de la qualité du code
  - Exécution des tests (avec détection automatique si configurés)
  - Validation du schéma Prisma (`pnpm prisma:validate`)
  - Génération du client Prisma (`pnpm prisma:generate`)
  - Build complet du projet (`pnpm build`)
- Ajout d'un badge de statut CI dans le README pour visualiser l'état du build.

## 6. Mise en place de l'exécution des tests unitaires

- Nous avons choisi Vitest car plus rapide que Jest il est compatible avec TypeScript et supporte ESM natif.
- Installation de Vitest dans chaque package avec `pnpm add -D vitest`.
- Mise en place de tests factice dans chaque package.
- Exécution des tests dans chaque package (`pnpm test`).
- Mise en place d'un script pour pouvoir excuter les tests de chaque package (`pnpm test, pnpm backend:test, pnpm fontend:test`).

## 7. Mise en place des tests end-to-end (e2e)

- Nous avons choisi Cypress car nous utilisons un projet moderne frontend et un CI/CD très bien supporté.
- Création d'un dossier `e2e` à la racine du projet.
- Initialisation d'un projet Node.js dans ce dossier.
- Installation de Cypress dans ce dossier `pnpm add -D cypress`.
- Premier lancement de Cypress avec `pnpx cypress open` : création automatique de la structure de dossiers `cypress/` dans `e2e` et ouverture de l'interface graphique.

## 8. Backend : Implémentation du CRUD utilisateur\*\*

- Création des routes REST pour les utilisateurs (création, lecture, mise à jour, suppression) dans `backend/src/routes/user.router.ts`.
- Développement des contrôleurs associés dans `backend/src/controllers/userControllers.ts`.
- Mise en place des schémas de validation (ex : `usersSchema.ts`).
- Ajout de la gestion de l’authentification (middleware `auth.ts`).
- Rédaction de tests unitaires pour chaque endpoint utilisateur.

## 9. Frontend : pages utilisateurs et authentification\*\*

- Création de la page de login (`frontend/src/pages/users/login.tsx`).
- Développement de la page de liste des utilisateurs (`frontend/src/pages/users/users-list.tsx`).
- Création de la page de détail utilisateur (`frontend/src/pages/users/detail.tsx`).
- Intégration d’un formulaire de création/modification utilisateur (`frontend/src/pages/users/form.tsx`).
- Utilisation de wretch (`frontend/src/utils/api.ts`) pour connecter le frontend au backend et consommer l’API REST.

## 10. Connexion frontend-backend\*\*

- Configuration de wretch pour pointer vers l’API backend.
- Gestion des appels API pour l’authentification, la récupération, la création, la modification et la suppression d’utilisateurs.
- Affichage dynamique des données utilisateurs dans le frontend.

## 11. Backend : Implémentation du CRUD projet\*\*

- Création des routes REST pour les projets (création, lecture, mise à jour, suppression) dans `backend/src/routes/project.router.ts`.
- Développement des contrôleurs associés dans `backend/src/controllers/projectControllers.ts`.
- Mise en place des schémas de validation (ex : `projectsSchema.ts`).
- Rédaction de tests unitaires pour chaque endpoint utilisateur.

## 12. Frontend : pages projets\*\*

- Développement de la page de liste des projets (`frontend/src/pages/projects/projects-list.tsx`).
- Création de la page de détail projet (`frontend/src/pages/projects/detail.tsx`).
- Intégration d'un formulaire de création/modification projet (`frontend/src/pages/projects/form.tsx`).

## 13.Backend : Implémentation du CRUD team\*\*

- Création des routes REST pour les teams (création, lecture, mise à jour, suppression) dans `backend/src/routes/team.router.ts`.
- Développement des contrôleurs associés dans `backend/src/controllers/teamControllers.ts`.
- Mise en place des schémas de validation (ex : `teamsSchema.ts`).
- Rédaction de tests unitaires pour chaque endpoint d'équipe.

## 14. Frontend : pages équipes\*\*

- Développement de la page de liste des équipes (`frontend/src/pages/teams/teams-list.tsx`).
- Création de la page de détail d'équipe (`frontend/src/pages/teams/detail.tsx`).
- Intégration d'un formulaire de création/modification équipe (`frontend/src/pages/teams/form.tsx`).
