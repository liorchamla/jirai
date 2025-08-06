import prisma from "../src/utils/prisma";
import argon2 from "argon2";
import { fakerFR as faker } from "@faker-js/faker";

// On supprime les données existantes (dans l'ordre des dépendances)
await prisma.ticket.deleteMany();
await prisma.epic.deleteMany();
await prisma.status.deleteMany();
await prisma.team.deleteMany();
await prisma.project.deleteMany();
await prisma.user.deleteMany();

// On crée un utilisateur administrateur

const passwordHash = await argon2.hash("Password1@");

const user = await prisma.user.create({
  data: {
    username: "Vince",
    email: "vince@mail.com",
    position: "Dev",
    password: passwordHash,
  },
});

// On créait cinq équipes
const teams = await prisma.team.createManyAndReturn({
  data: [
    { name: "Dev frontend", slug: "dev-frontend", createdBy: user.uuid },
    { name: "Dev backend", slug: "dev-backend", createdBy: user.uuid },
    { name: "Dev fullstack", slug: "dev-fullstack", createdBy: user.uuid },
    { name: "Dev mobile", slug: "dev-mobile", createdBy: user.uuid },
    { name: "QA", slug: "qa", createdBy: user.uuid },
  ],
});

// On créait quarante utilisateurs
const usersData = Array.from({ length: 40 }, () => ({
  username: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  position: faker.person.jobTitle(),
  password: passwordHash,
}));

for (const userData of usersData) {
  await prisma.user.create({
    data: {
      ...userData,
      teams: {
        connect: faker.helpers
          .arrayElements(teams, { min: 0, max: 3 })
          .map((team) => ({ slug: team.slug })),
      },
    },
  });
}

// On crée les projets
const projectsData = [
  {
    name: "Trello",
    slug: "trello",
    description: "Un projet de gestion de tâches",
    createdBy: user.uuid,
    status: "active",
  },
  {
    name: "Batman",
    slug: "batman",
    description: "Un projet sur le super-héros de Gotham",
    createdBy: user.uuid,
    status: "archived",
  },
  {
    name: "L'étrange Noël de Jack",
    slug: "l-etrange-noel-de-jack",
    description: "Un projet de film d'animation",
    createdBy: user.uuid,
    status: "active",
  },
  {
    name: "Le Seigneur des Anneaux",
    slug: "le-seigneur-des-anneaux",
    description: "Un projet de trilogie épique",
    createdBy: user.uuid,
    status: "active",
  },
];

for (const projectData of projectsData) {
  await prisma.project.create({
    data: {
      ...projectData,
      teams: { connect: teams.map((team) => ({ slug: team.slug })) },
    },
  });
}

// On crée les statuts pour les EPICs
const statuses = await prisma.status.createManyAndReturn({
  data: [
    { name: "thinking" },
    { name: "ready" },
    { name: "in_progress" },
    { name: "done" },
    { name: "canceled" },
  ],
});

// On récupère tous les projets créés
const projects = await prisma.project.findMany();

// On récupère tous les utilisateurs pour les assigner aux EPICs
const allUsers = await prisma.user.findMany();

// On crée des EPICs pour chaque projet (entre 0 et 5 EPICs par projet)
for (const project of projects) {
  const numberOfEpics = faker.number.int({ min: 0, max: 5 });

  // Titres d'EPICs réalistes en français
  const epicTitles = [
    "Authentification utilisateur",
    "Gestion des droits d'accès",
    "Interface de tableau de bord",
    "Système de notifications",
    "API REST complète",
    "Optimisation des performances",
    "Tests automatisés",
    "Documentation technique",
    "Migration de données",
    "Sécurisation des endpoints",
    "Interface mobile responsive",
    "Système de cache",
    "Gestion des erreurs",
    "Monitoring et logs",
    "Déploiement automatisé",
  ];

  // Descriptions réalistes en français
  const epicDescriptions = [
    "Mise en place d'un système d'authentification sécurisé avec gestion des sessions utilisateurs.",
    "Développement d'une interface intuitive permettant aux utilisateurs de naviguer facilement.",
    "Création d'une API robuste pour permettre l'intégration avec d'autres services.",
    "Implémentation d'un système de notifications en temps réel pour améliorer l'expérience utilisateur.",
    "Optimisation des performances de l'application pour réduire les temps de chargement.",
    "Mise en place d'une suite de tests automatisés pour garantir la qualité du code.",
    "Développement d'une interface responsive adaptée aux appareils mobiles.",
    "Création d'un tableau de bord avec des métriques et indicateurs de performance.",
    "Implémentation d'un système de cache pour améliorer les performances de l'application.",
    "Mise en place d'un système de monitoring et de logs pour faciliter le débogage.",
    "Sécurisation de l'application contre les vulnérabilités courantes.",
    "Développement d'une documentation technique complète pour l'équipe de développement.",
    "Migration des données existantes vers la nouvelle architecture.",
    "Mise en place d'un pipeline de déploiement automatisé.",
    "Amélioration de l'expérience utilisateur sur les fonctionnalités principales.",
  ];

  for (let i = 0; i < numberOfEpics; i++) {
    const assignedUser = faker.helpers.maybe(
      () => faker.helpers.arrayElement(allUsers),
      { probability: 0.7 }
    );

    await prisma.epic.create({
      data: {
        title: faker.helpers.arrayElement(epicTitles),
        description: faker.helpers.arrayElement(epicDescriptions),
        priority: faker.helpers.arrayElement([
          "frozen",
          "low",
          "medium",
          "high",
        ]),
        createdBy: user.uuid,
        assignedTo: assignedUser?.uuid,
        projectSlug: project.slug,
        statusId: faker.helpers.arrayElement(statuses).id,
      },
    });
  }
}

// On récupère tous les epics créés pour leur ajouter des tickets
const allEpics = await prisma.epic.findMany();

// On crée des TICKETS pour chaque epic (entre 0 et 5 tickets par epic)
for (const epic of allEpics) {
  const numberOfTickets = faker.number.int({ min: 0, max: 5 });

  // Titres de tickets réalistes en français
  const ticketTitles = [
    "Corriger le bug de connexion",
    "Ajouter la validation des champs",
    "Implémenter le tri des données",
    "Optimiser la requête SQL",
    "Créer les tests unitaires",
    "Mettre à jour la documentation",
    "Refactoriser le code legacy",
    "Ajouter la gestion d'erreurs",
    "Implémenter le cache Redis",
    "Créer l'interface utilisateur",
    "Configurer les variables d'environnement",
    "Ajouter les logs de sécurité",
    "Optimiser les performances",
    "Implémenter la pagination",
    "Créer les migrations de base de données",
    "Ajouter les validations côté serveur",
    "Configurer le monitoring",
    "Implémenter l'upload de fichiers",
    "Créer les fixtures de test",
    "Ajouter l'internationalisation",
  ];

  // Descriptions réalistes en français
  const ticketDescriptions = [
    "Résoudre le problème qui empêche les utilisateurs de se connecter dans certains cas.",
    "Ajouter des validations robustes pour tous les champs de saisie utilisateur.",
    "Permettre aux utilisateurs de trier les données selon différents critères.",
    "Optimiser les performances de la base de données en révisant les requêtes.",
    "Créer une suite de tests unitaires pour couvrir les fonctionnalités critiques.",
    "Mettre à jour la documentation technique pour refléter les derniers changements.",
    "Refactoriser l'ancien code pour améliorer la maintenabilité et les performances.",
    "Implémenter une gestion d'erreurs centralisée et robuste.",
    "Mettre en place un système de cache pour améliorer les temps de réponse.",
    "Développer une interface utilisateur intuitive et responsive.",
    "Configurer correctement toutes les variables d'environnement nécessaires.",
    "Ajouter des logs détaillés pour le monitoring de sécurité.",
    "Identifier et résoudre les goulots d'étranglement de performance.",
    "Implémenter un système de pagination efficace pour les grandes listes.",
    "Créer les scripts de migration pour la mise à jour de la base de données.",
    "Ajouter des validations côté serveur pour sécuriser l'application.",
    "Configurer les outils de monitoring et d'alertes.",
    "Permettre aux utilisateurs d'uploader et de gérer leurs fichiers.",
    "Créer des données de test réalistes pour faciliter le développement.",
    "Ajouter le support multi-langues à l'application.",
  ];

  for (let i = 0; i < numberOfTickets; i++) {
    const assignedUser = faker.helpers.maybe(
      () => faker.helpers.arrayElement(allUsers),
      { probability: 0.8 }
    );

    await prisma.ticket.create({
      data: {
        title: faker.helpers.arrayElement(ticketTitles),
        description: faker.helpers.arrayElement(ticketDescriptions),
        priority: faker.helpers.arrayElement([
          "frozen",
          "low",
          "medium",
          "high",
        ]),
        createdBy: user.uuid,
        assignedTo: assignedUser?.uuid,
        epicId: epic.id,
        statusId: faker.helpers.arrayElement(statuses).id,
      },
    });
  }
}
