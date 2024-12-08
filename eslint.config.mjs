import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node, // Adds Node.js globals
    },
    rules: {
      "no-undef": "error", // Ensures variables are defined
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      semi: ["error", "always"], // Enforces semicolons
      quotes: ["error", "double"], // Enforces double quotes
      indent: ["error", 2], // Enforces 2-space indentation
    },
  },
  pluginJs.configs.recommended, // Applies ESLint recommended rules
];
