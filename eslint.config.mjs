import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-focused-test': 'error',
      'playwright/missing-playwright-await': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
  eslintConfigPrettier
);
