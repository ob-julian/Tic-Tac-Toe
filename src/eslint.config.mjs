import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/server/**/*.js'],
    languageOptions: {sourceType: 'commonjs', globals: globals.node}
  },
  {
    files: ['**/client/**/*.js'],
    languageOptions: {sourceType: 'module', globals: globals.browser}
  },
  {
    rules: {
      'quotes': ['error', 'single'],
      'space-infix-ops': 'error',
      'comma-spacing': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'semi': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'eqeqeq': 'warn'
    },
  },
  {files: ['**/*.js'], ...pluginJs.configs.recommended},
];