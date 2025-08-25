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

## INTERMEDIAIRE (Lior) : refactorings de prisma

- On ne veut pas avoir à gérer nous mêmes les tables intermédiaires, ce ne sont que des détails d'implémentation qu'on laisse à Prisma. On utilise donc des relations N-N "implicites" (voir https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations#implicit-many-to-many-relations)
- Ce qui a donc modifié la présentation des données dans notre API et qui a nécessité de mettre à jour nos tests unitaires mais aussi nos types sur le front.
- On a refactorisé le controller UserController car il y'avait beaucoup de code dupliqué et compliqué à lire
- On en a profité pour commenter en profondeur le UserController pour vraiment comprendre ce que chaque bloc de code fait
- Enfin on a modifié la CI afin que le nom du job "lint-and-format" devienne "quality-and-tests" qui colle beaucoup plus à ce qu'on y fait

## 15. Création d'un seed pour pourvoir travailler sur notre frontend en développement

- Création du fichier `seed.ts` dans le backend (`backend/commands/seed.ts`).
- Installatuon de la dépendance "faker" pour pouvoir générer des données aléatoire.
- Mise en place des fonctions de créations des données avec "faker" dans le fichier `seed.ts`.
- Ajout du script dans package.json du backend pour pouvoir lancer notre seeding `pnpm db:seed`.
- Contrôle du bon fonctionnement du script.

## 16. Ajout d'un AuthContext pour pouvoir accéder au données de l'utilisateur loger

- Changement des conditions qui ne peut être effectué que par son créateur au niveau de la modifation et suppression d'un projet
- Modification du fichier `auth.ts` avec un AuthContext et un useAuth.
- Ajout du `AuthContext` sur le fichier `App.tsx`.
- Vérification du bon fonctionnement du AuthContext.

## 17. Ajout de l'éditeur de PrimeReact

- Mise en place du composent Editor de PrimeReact.
- Vérification de son bon fonctionement.
- Réctification de l'affichage du détail du projet.

## 18. Backend : Implémentation du CRUD Epic

- Ajout du modèle `epic` dans le schéma Prisma (`backend/prisma/schema.prisma`) avec les champs.
- Relations établies avec les modèles `User`, `Project` et `Status`.
- Création des routes REST pour les epics dans `backend/src/routes/epic.router.ts`.
- Développement des contrôleurs associés dans `backend/src/controllers/epicControllers.ts`.
- Mise en place des schémas de validation avec Zod dans `backend/src/schemas/epicsSchema.ts`.
- Rédaction de tests unitaires complets pour chaque endpoint epic.

## 19. Frontend : Implémentation de création et modification des EPIC et visualisation de leur détails

- Création du composant `EpicForm` (`frontend/src/pages/epics/epicForm.tsx`) pour la création et modification d'epics avec validation côté client.
- Développement de la page de détail d'epic (`frontend/src/pages/epics/detail.tsx`) avec possibilité de modification via dialog modal.
- Intégration des epics dans la page de détail de projet (`frontend/src/pages/projects/detail.tsx`) avec affichage de la liste et actions (ajout, modification).
- Mise en place de l'éditeur PrimeReact pour la description des epics avec formatage riche (gras, italique, souligné).
- Ajout de la route pour visualiser le détail d'un epic (`/projects/:slug/epics/:id`) dans `App.tsx`.
- Configuration des appels API pour les opérations CRUD epics (création, lecture, modification) via `wretch` dans le frontend.

## 20. Refactoring du frontend : structure et nommage (Lior Chamla)

- Uniformisation du nommage des fichiers de composants, pages et types selon les conventions du README (PascalCase pour les composants, pages et types).
- Renommage des fichiers du dossier `types` : `user.ts`, `project.ts`, `epic.ts`, `team.ts` → `User.ts`, `Project.ts`, `Epic.ts`, `Team.ts`.
- Renommage des fichiers du dossier `pages` pour chaque entité :
  - `users-list.tsx` → `UsersList.tsx`, `form.tsx` → `Form.tsx`, `login.tsx` → `Login.tsx`, `detail.tsx` → `Detail.tsx` (idem pour projects, teams, epics).
- Correction de tous les imports dans le frontend pour respecter la casse et la nouvelle convention.
- Mise à jour du README du frontend pour expliciter les conventions de nommage et la structure des dossiers.
- Vérification de la cohérence globale et redémarrage du serveur de développement pour éviter les erreurs liées à la casse.

## 21. Implémentation des TICKET avec leur création, visualisation et modification liés à un EPIC

- Ajout du modèle `ticket` dans le schéma Prisma (`backend/prisma/schema.prisma`) avec les champs requis (titre, description, priorité, epicId, etc.).
- Relations établies avec les modèles `User`, `Epic` et `Status`.
- Création des routes REST pour les tickets dans `backend/src/routes/ticket.router.ts` (GET, POST, PATCH).
- Développement des contrôleurs associés dans `backend/src/controllers/ticketControllers.ts` pour gérer le CRUD complet.
- Mise en place des schémas de validation avec Zod dans `backend/src/schemas/ticketsSchemas.ts`.
- Rédaction de tests unitaires complets pour chaque endpoint ticket.
- Création du composant `TicketForm` (`frontend/src/pages/tickets/TicketForm.tsx`) pour la création et modification de tickets avec validation côté client.
- Développement de la page de détail de ticket (`frontend/src/pages/tickets/Detail.tsx`) avec possibilité de modification via dialog modal.
- Intégration des tickets dans la page de détail d'epic (`frontend/src/pages/epics/Detail.tsx`) avec affichage de la liste et actions (ajout, modification).
- Ajout de la route pour visualiser le détail d'un ticket (`/ticket/:id`) dans `App.tsx`.
- Configuration des appels API pour les opérations CRUD tickets via `wretch` dans le frontend.
- Mise en place de l'éditeur PrimeReact pour la description des tickets avec formatage riche (gras, italique, souligné).

## 22. Implémentation des status dans les EPIC et TICKET

- Création du schéma de validation Zod pour les status dans `backend/src/schemas/statusSchema.ts`.
- Mise en place de la fonction utilitaire `findStatusByName` dans `backend/src/utils/validation.ts` pour récupérer un status par son nom.
- Modification des contrôleurs `epicControllers.ts` et `ticketControllers.ts` pour :
  - Assigner automatiquement le status par défaut "thinking" lors de la création d'un epic ou ticket
  - Inclure les informations de status dans les réponses des API (GET)
- Création du type TypeScript `Status` dans `frontend/src/types/Status.ts` pour typer les données côté frontend.
- Développement du composant `StatusBadge` (`frontend/src/components/StatusBadge.tsx`) pour afficher visuellement les status avec des icônes PrimeReact colorées selon l'état.
- Intégration des badges de status dans les interfaces de visualisation des epics et tickets du frontend.
- Ajout des TICKET dans le `seed`.

## 23. Implémentation du CRUD pour les commentaires

- Ajout du modèle `Comment` dans le schéma Prisma (`backend/prisma/schema.prisma`) avec les champs requis (contenu, createdBy, epicId, ticketId, etc.).
- Relations établies avec les modèles `User`, `Epic` et `Ticket` permettant d'associer les commentaires aux epics ou aux tickets.
- Création des routes REST pour les commentaires dans `backend/src/routes/comment.router.ts` (GET, POST, PATCH, DELETE).
- Développement des contrôleurs associés dans `backend/src/controllers/commentControllers.ts` pour gérer le CRUD complet.
- Mise en place des schémas de validation avec Zod dans `backend/src/schemas/commentsSchema.ts`.
- Rédaction de tests unitaires complets pour chaque endpoint de commentaire.
- Intégration des commentaires dans le router principal (`backend/src/routes/index.router.ts`).
- Ajout des commentaires dans le système de seed (`backend/commands/seed.ts`).

## 24. Implémentation des commentaires sur les EPIC et TICKET sur le frontend

- Création du type TypeScript `Comment` dans `frontend/src/types/Comment.ts` pour typer les données des commentaires côté frontend avec les propriétés (id, content, createdBy, createdAt, updatedAt, creator).
- Développement du composant `CommentForm` (`frontend/src/pages/comments/commentForm.tsx`) pour la création de commentaires avec validation côté client.
- Intégration des commentaires dans la page de détail d'epic (`frontend/src/pages/epics/Detail.tsx`).
- Intégration des commentaires dans la page de détail de ticket (`frontend/src/pages/tickets/Detail.tsx`).
- Configuration des appels API pour la création de commentaires via `wretch` dans le frontend avec gestion des erreurs d'authentification et de validation.

## 25. Implémentation de la modification et suppression des commentaires sur le frontend

- Ajout de la fonctionnalité de modification des commentaires dans le composant `CommentForm` (`frontend/src/pages/comments/CommentForm.tsx`) avec une logique conditionnelle pour différencier création et modification.
- Intégration des boutons d'édition et de suppression dans les pages de détail d'epic (`frontend/src/pages/epics/Detail.tsx`) et de ticket (`frontend/src/pages/tickets/Detail.tsx`) avec contrôle d'accès (seul le créateur du commentaire peut le modifier/supprimer).
- Mise en place de l'édition inline des commentaires : clic sur le bouton "crayon" transforme l'affichage du commentaire en formulaire d'édition avec l'éditeur PrimeReact.
- Implémentation de la fonctionnalité de suppression avec confirmation via une boîte de dialogue modale (`Dialog` de PrimeReact) pour éviter les suppressions accidentelles.
- Développement de la méthode `handleConfirmDelete` dans les pages de détail epic et ticket utilisant l'endpoint DELETE `/comments/:id` pour supprimer définitivement un commentaire.
- Respect des autorisations : seuls les commentaires créés par l'utilisateur connecté affichent les boutons de modification et suppression.

## 26. Intégration des fonctionnalités IA

- Configuration de l'intégration OpenAI dans le backend avec création du fichier utilitaire `backend/src/utils/openai.ts` pour initialiser le client OpenAI avec la clé API.
- Création du schéma de validation `backend/src/schemas/openaiSchema.ts` avec Zod pour valider les données d'entrée (titre obligatoire avec minimum 2 caractères).
- Développement des contrôleurs OpenAI dans `backend/src/controllers/openaiControllers.ts` avec 4 fonctionnalités principales :
  - `getSummaryCommentEpic` : génère un résumé automatique des commentaires d'un epic en utilisant GPT-3.5-turbo
  - `getSummaryCommentTicket` : génère un résumé automatique des commentaires d'un ticket en utilisant GPT-3.5-turbo
  - `getDescriptionNewEpic` : génère automatiquement une description détaillée pour un epic à partir de son titre et du contexte du projet
  - `getDescriptionNewTicket` : génère automatiquement une description détaillée pour un ticket à partir de son titre et du contexte de l'epic/projet
- Mise en place des routes API dans `backend/src/routes/openai.router.ts` :
  - `GET /epic/:id/summary` pour le résumé des commentaires d'epic
  - `GET /ticket/:id/summary` pour le résumé des commentaires de ticket
  - `POST /automation/:projectSlug/epic` pour la génération de description d'epic
  - `POST /automation/:epicId/ticket` pour la génération de description de ticket
- Gestion robuste des erreurs avec traitement spécial des erreurs de quota OpenAI (status 429) qui retournent des messages d'erreur utilisateur-friendly au lieu d'échouer.
- Intégration côté frontend dans `EpicForm.tsx` avec bouton "Générer automatiquement" qui appelle l'API d'automation pour pré-remplir le champ description d'un epic.
- Intégration côté frontend dans `TicketForm.tsx` avec bouton "Générer automatiquement" qui appelle l'API d'automation pour pré-remplir le champ description d'un ticket.
- Ajout de boutons "Résumer les commentaires (IA)" dans les pages de détail d'epic (`Detail.tsx`) et ticket (`Detail.tsx`) qui affichent un résumé généré par l'IA des discussions.
- Mise en place d'états de chargement (`loadingSummary`, `loadingDescription`) avec indicateurs visuels pour améliorer l'expérience utilisateur pendant les appels à l'API OpenAI.
- Respect des bonnes pratiques de sécurité : toutes les interactions avec OpenAI passent exclusivement par le backend, les clés API ne sont jamais exposées côté frontend.
- Prompts optimisés pour générer des descriptions au format HTML avec formatage riche (gras, listes, couleurs) directement intégrables dans l'éditeur PrimeReact.

## 27. Déploiement Backend et Frontend

- Préparation du déploiement avec création du script `render-build.sh` pour automatiser le processus de build sur Render :
  - Installation des dépendances avec `pnpm install`
  - Build du backend avec compilation TypeScript
  - Génération du client Prisma
  - Exécution des migrations de base de données avec `prisma migrate deploy`
- Configuration des scripts de déploiement dans le `package.json` racine :
  - `prisma:migrate:deploy` pour déployer les migrations en production
  - `create:user:prod` pour créer un utilisateur administrateur initial en production via variables d'environnement
  - `db:seed-status` pour initialiser les statuts par défaut (thinking, doing, done, canceled)
  - `render:build` qui combine toutes les étapes nécessaires au déploiement
- Mise en place de la gestion des variables d'environnement pour la production :
  - Backend : `DATABASE_URL`, `OPENAI_API_KEY`, `PORT` pour la configuration serveur
  - Frontend : `VITE_API_URL` pour pointer vers l'API backend déployée
- Configuration du frontend pour le déploiement :
  - Fichier `_redirects` dans `public/` pour gérer le routing côté client avec les SPA (`/* /index.html 200`)
  - Variable d'environnement `VITE_API_URL` pour adapter l'URL de l'API selon l'environnement (dev/prod)
- Création du script CLI `create-user.ts` pour l'initialisation d'un utilisateur administrateur en production :
  - Validation des paramètres avec Zod (`createUserOnCommandSchema`)
  - Vérification de l'unicité de l'email et du nom d'utilisateur
  - Hashage sécurisé du mot de passe avec Argon2
  - Messages d'erreur détaillés et gestion robuste des cas d'échec
- Architecture de déploiement recommandée :
  - Backend déployé sur Render/Railway/Fly.io avec base de données PostgreSQL
  - Frontend déployé sur Vercel/Netlify avec configuration des variables d'environnement
  - Séparation des environnements dev/staging/production avec variables spécifiques
