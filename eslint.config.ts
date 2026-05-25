import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Flat Config を一貫して使用し、型不整合を回避
export default tseslint.config(
  // JS 向け設定
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  // TS 向け推奨セット（FlatConfigArray）を展開
  ...tseslint.configs.recommended,
  // Vitest グローバルをテストファイルで有効化（Flat Config 方式）
  {
    name: "vitest-globals",
    files: [
      "**/*.test.{ts,tsx,js,jsx,mts,cts}",
      "**/*.spec.{ts,tsx,js,jsx,mts,cts}",
      "tests/**/*.{ts,tsx,js,jsx,mts,cts}",
      "test/**/*.{ts,tsx,js,jsx,mts,cts}",
    ],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  }
);
