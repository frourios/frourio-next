import js from '@eslint/js';
import gitignore from 'eslint-config-flat-gitignore';
import prettierConfig from 'eslint-config-prettier';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import type { Config } from 'typescript-eslint';
import tseslint from 'typescript-eslint';

const config: Config = tseslint.config(
  { files: ['**/*.{ts,tsx}'] },
  gitignore({ files: ['./.gitignore', './.prettierignore'] }),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2020 },
    },
    rules: {
      eqeqeq: 'error',
      'no-param-reassign': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'testing-library/no-unnecessary-act': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: 'OptionalChain', message: 'Optional chaining (?.) is not allowed.' },
      ],
    },
  },
  prettierConfig,
);

export default config;
