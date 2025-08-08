import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import { globalIgnores } from "eslint/config";

/**
 * ESLint Flat Config pour Node.js + TypeScript (backend)
 */
export default [
  js.configs.recommended,
  globalIgnores(["**/dist/**"]),
  {
    files: ["**/*.{ts,js,cjs,mjs}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
];
