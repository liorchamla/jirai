import js from "@eslint/js";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";

/**
 * ESLint Flat Config pour Vite + React + TypeScript + Prettier
 */
export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      react,
      prettier,
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "warn",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
