// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/"]
  },
  {
    files: ["src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
