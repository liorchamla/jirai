import prisma from "../src/utils/prisma";
import argon2 from "argon2";
import { faker } from "@faker-js/faker";

// On supprime les données existantes
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
  username: faker.internet.username(),
  email: faker.internet.email().toLowerCase(),
  position: faker.person.jobTitle().toLowerCase(),
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
