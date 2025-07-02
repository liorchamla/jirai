## Cahier des charges - Projet "JirAI" ✨🧠🛠️

![CI](https://github.com/VincentDelaye/jirai/workflows/CI/badge.svg)

### 1. Présentation générale 📌📋📈

**Nom du projet :** JirAI
**Objectif :** Créer un logiciel de gestion de projet inspiré de Jira, enrichi de fonctionnalités basées sur l'intelligence artificielle (OpenAI).
**Public visé :** Équipes de développement, chefs de projet, start-ups tech.

### 2. Objectifs pédagogiques du stage 🎓💻🔍

🧪 **Exigence de qualité de code :** L’ensemble du projet devra faire l’objet d’un effort particulier sur la qualité du code. Cela inclut l’écriture systématique de **tests unitaires** pour les fonctions critiques, ainsi que de **tests end-to-end (e2e)** pour les parcours utilisateurs majeurs. Les tests doivent pouvoir être exécutés régulièrement via CI afin de détecter toute régression.✨📐⚙️

- Apprendre à initier et structurer un projet complet.
- Mettre en œuvre des pratiques professionnelles (Git, CI/CD, documentation, tests, etc.).
- Découvrir l'intégration d'une API d'IA (OpenAI).
- Développer une architecture front + back cohérente.
- Comprendre les enjeux d’un projet de gestion collaboratif.

### 3. Fonctionnalités attendues (MVP) 🚀🔧📦

Le MVP (Minimum Viable Product) de JirAI a pour but de livrer une première version fonctionnelle du logiciel permettant de gérer des projets d'équipe de façon collaborative. Il est composé exclusivement des fonctionnalités essentielles nécessaires pour tester l'expérience globale du produit sans entrer dans des détails techniques ou fonctionnels avancés. Les fonctionnalités IA sont considérées comme un plus mais non indispensables pour la stabilité du socle.💡🛤️🧪

#### Périmètre fonctionnel de la V0 (MVP clair) 🗂️🔍📘

L'objectif est de reproduire les fonctionnalités de base de Jira, structurées selon trois piliers fondamentaux : **projets**, **équipes**, et **tâches hiérarchisées**. Voici les exigences détaillées pour la V0 :

##### 🔹 Gestion de projets

- Création d’un projet avec un nom, une description et un statut (actif/inactif)
- Visualisation de la liste des projets accessibles à l’utilisateur connecté
- Consultation de la fiche détaillée d’un projet (vue "projet")

##### 🔹 Gestion des équipes et des utilisateurs

- Création d’une équipe avec un nom
- Ajout de plusieurs utilisateurs à une équipe (fonctionnalité manuelle sans invitation par mail)
- Une équipe peut être associée à plusieurs projets
- Un projet peut embarquer plusieurs équipes
- Affichage des membres d'une équipe sur la fiche projet

##### 🔹 Gestion des tâches hiérarchisées

- L’éditeur de description pour les EPIC, TICKETS et TÂCHES doit être **riche** (formatage, listes, titres, etc.)
- Il doit permettre l’**upload et l’insertion d’images** dans le contenu
- Création d’un **EPIC** (titre + description)
- Création de **TICKETS** rattachés à un EPIC, contenant un titre, une description, une priorité
- Création de **TÂCHES** rattachées à un ticket, contenant un titre, une description, une priorité
- Tous les objets (EPIC, TICKET, TÂCHE) possèdent :

  - Un **rapporteur** (utilisateur qui a créé ou suit l’élément)
  - Un **assigné** (utilisateur responsable de sa réalisation)
  - Un **statut** parmi :

    - En réflexion
    - Prêt
    - En cours
    - En pull request
    - Mergé
    - QA Validation
    - Fermé
    - Annulé

  - Un fil de **commentaires** permettant des discussions autour de l'objet, avec un **éditeur riche** (formatage, listes, liens, etc.) et la possibilité d’**uploader des images**

- Une tâche peut être liée à un ticket, qui lui-même est lié à un EPIC

Les rôles utilisateurs seront considérés comme non hiérarchisés pour cette version (pas de distinction admin/membre, tous les utilisateurs ont les mêmes droits sur leurs projets).🔁🧑‍💻🔓

#### Fonctionnalités IA (OpenAI) 🤖📝💬

L’objectif est d’introduire des premiers apports d’intelligence artificielle utiles et simples à intégrer dès la version MVP :

- ✅ **Aide à la rédaction enrichie**
  Pour tout élément (EPIC, TICKET ou TÂCHE), l’utilisateur peut demander une génération automatique de la description à partir :

  - d’un début de phrase ou d’un titre saisi,
  - du contexte du projet (nom, description, objectifs déjà définis, éléments liés).

- ✅ **Résumé automatique des discussions**
  Dans chaque fil de commentaires, l’IA peut produire un résumé synthétique pour faciliter la lecture rapide et le suivi du ticket.

### 4. Stack technique proposée (à affiner ensemble) 🧱🛠️🔌

⚠️ **Sécurité OpenAI :** Il est strictement interdit d'appeler directement les modèles OpenAI depuis le frontend. Toutes les interactions avec l'API OpenAI doivent obligatoirement passer par le backend, afin de préserver la confidentialité des clés API et d'encadrer les usages.🔐🧰🧱

#### Frontend

- React avec TypeScript
- TailwindCSS pour le style
- Utilisation potentielle de bibliothèques comme React Query, Zustand ou Redux Toolkit
- Intégration d’un éditeur riche (ex: TipTap, Lexical, Draft.js, etc.) avec support d’upload d’images

#### Backend

- Node.js avec **Express** et **TypeScript**
- ORM : **Prisma**
- API REST (architecture simple et rapide à mettre en œuvre pour un MVP)
- Middleware de gestion des erreurs, validation via Zod ou Joi
- Service de gestion d’upload d’images (Cloudinary, S3, ou file system local en développement)

#### Base de données

- PostgreSQL (recommandée avec Prisma)

#### Autres outils

- Git + GitHub (repo privé/public)
- Docker (optionnel si temps)
- CI/CD simple avec GitHub Actions
- Déploiement sur :

  - Vercel / Netlify pour le frontend
  - Render / Railway / Fly.io pour le backend

### 5. Étapes du projet 🧭📆📂

6. Mise en place de suites de tests robustes (unitaires et end-to-end), avec exécution régulière dans la CI pour garantir l'absence de régressions
7. Déploiement final
8. Présentation du projet / mini soutenance

### 6. Modalités d'accompagnement 🤝🗓️📈

- Points quotidiens (stand-up de 10–15 min)
- Revue de code régulière
- Documentation des choix et apprentissages dans un `JOURNAL.md`
- Présentation hebdomadaire des avancements

### 7. Livrables 📤🧾📦

- Code source documenté (README, commentaires, etc.)
- Application déployée en ligne
- Présentation finale (slides ou démonstration live)
- Journal de bord du stage (JOURNAL.md)

### 8. Pistes d’amélioration post-MVP 🧠🔄🌱

- Génération automatique de TICKETS (user stories) à partir d'une EPIC donnée via l'IA
- Notion de **Sprints** pour organiser les tickets dans des cycles de développement courts
- Vue **Kanban** pour visualiser les tâches selon leur statut de manière dynamique
- Notifications (emails ou dans l’appli)
- Système de permissions avancé
- Intégration avec GitHub / GitLab
