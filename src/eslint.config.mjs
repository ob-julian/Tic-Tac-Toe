import globals from 'globals';
import pluginJs from '@eslint/js';
import htmlPlugin from 'eslint-plugin-html';
import htmlEslintPlugin from '@html-eslint/eslint-plugin';
import parser from '@html-eslint/parser';

export default [
  {
    files: ['**/server/**/*.js'],
    languageOptions: {sourceType: 'commonjs', globals: globals.node}
  },
  {
    files: ['**/client/**/*.{js,html}'],
    languageOptions: {sourceType: 'module', globals: globals.browser},
    plugins: {'html': htmlPlugin}
  },
  {
    files: ['**/client/**/*.html'],
    plugins: {'@html-eslint': htmlEslintPlugin},
    languageOptions: {parser},
    ...htmlEslintPlugin.configs['flat/recommended']
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