# JirAI Frontend

Ce projet est le frontend d’une application de gestion de projets, développée avec React, TypeScript et Vite.

## Contexte

JirAI est une application collaborative permettant de gérer des projets, des équipes, des utilisateurs et des epics. L’interface utilisateur est conçue pour être moderne, accessible et facilement maintenable.

## Stack technique

- React
- TypeScript
- Vite
- PrimeReact
- Cypress
- ESLint

## Structure des dossiers

```
frontend/
  src/
    components/      # Composants réutilisables (Header, PriorityBadge, etc.)
    pages/           # Pages de l’application, organisées par entité métier
    types/           # Types TypeScript partagés
    utils/           # Fonctions utilitaires (API, auth, etc.)
    assets/          # Images, icônes, etc.
    styles/          # Styles globaux (si besoin)
```

## Conventions de nommage

- **Composants React** : PascalCase (ex : `Header.tsx`, `PriorityBadge.tsx`)
- **Hooks personnalisés** : camelCase, suffixés par `use` (ex : `useAuth.ts`)
- **Utilitaires** : camelCase (ex : `api.ts`, `auth.ts`)
- **Types** : PascalCase (ex : `User.ts`, `Epic.ts`)
- **Pages** : PascalCase (ex : `Detail.tsx`, `Form.tsx`)
- **Dossiers** : kebab-case ou camelCase, selon la cohérence du projet

## Bonnes pratiques

- Les composants réutilisables sont placés dans `components/`.
- Les pages sont placées dans `pages/`, regroupées par entité métier (users, projects, epics, teams).
- Les types TypeScript sont centralisés dans `types/`.
- Les utilitaires sont dans `utils/`.
- Les imports de composants doivent respecter le nommage (ex : `import Header from "../components/Header"`).
- Les tests unitaires peuvent être placés dans un dossier `__tests__/` ou à côté du fichier testé.

## Exemple d’import

```tsx
import Header from "../components/Header";
import PriorityBadge from "../components/PriorityBadge";
```

## Contribution

Merci de respecter ces conventions pour faciliter la maintenance et l’évolution du projet. En cas de doute, demande à l’équipe ou consulte ce README.
