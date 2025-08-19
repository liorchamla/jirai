#!/bin/bash
# Installation des dépendances
pnpm install

# Build du backend
cd backend
pnpm build

# Génération du client Prisma
pnpm prisma:generate

# Migration de la base de données
pnpm prisma:migrate:deploy