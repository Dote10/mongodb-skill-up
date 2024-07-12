import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.es2016 } },
  pluginJs.configs.recommended,
];
