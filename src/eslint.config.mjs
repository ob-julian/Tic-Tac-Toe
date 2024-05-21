import globals from 'globals';
import pluginJs from '@eslint/js';
import htmlPlugin from 'eslint-plugin-html';
import htmlEslintPlugin from '@html-eslint/eslint-plugin';
import parser from '@html-eslint/parser';

const globalRules = {
  'quotes': ['error', 'single'],
  'space-infix-ops': 'error',
  'comma-spacing': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
  'semi': ['error', 'always'],
  'no-trailing-spaces': 'error',
  'eqeqeq': 'warn'
};

const clientRules = {
  ...globalRules,
  'no-undef': 'off',
  'no-unused-vars': 'off'
};

export default [
  {
    // Configuration for server-side JavaScript files
    files: ['**/server/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      ...globalRules
    }
  },
  {
    // Configuration for client-side JavaScript and HTML files
    files: ['**/client/**/*.js'],
    languageOptions: {
      sourceType: 'script',
    globals: globals.browser
    },
    plugins: {
      html: htmlPlugin
    },
    rules: {
      ...clientRules
    }
  },
  {
    // Configuration specifically for HTML files in the client folder
    files: ['**/client/**/*.html'],
    plugins: {
      '@html-eslint': htmlEslintPlugin
    },
    languageOptions: {
      parser
    },
    ...htmlEslintPlugin.configs['flat/recommended'],
    rules: {
      ...clientRules
    }
  },
  {
    // Applying recommended settings from @eslint/js for all JavaScript files
    files: ['**/*.js'],
    ...pluginJs.configs.recommended
  }
];