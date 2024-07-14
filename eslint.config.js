import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      'no-console': 'off',
    },
  },
  pluginJs.configs.recommended,
];
