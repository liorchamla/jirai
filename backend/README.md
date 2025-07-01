# Backend

## Prisma & PostgreSQL

1. Installation : `pnpm add prisma @prisma/client` puis `npx prisma init`
2. Ajout du modèle `User` dans `prisma/schema.prisma`
3. Migration : `npx prisma migrate dev --name init`
4. Contrôle : connexion à Postgres puis `\dt` et `\d users` pour vérifier la table
