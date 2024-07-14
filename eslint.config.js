import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.es2016 },
    rules: {
      //semi: 'error',
      quotes: ['error', 'single'],
      //'no-console': 'off',
    },
  },
  pluginJs.configs.recommended,
];
