module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react/jsx-runtime", "plugin:react-hooks/recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  ignorePatterns: ["dist", "public", ".eslintrc.cjs"],
  overrides: [{ files: ["vite.config.js", "src/admin/check.mjs"], env: { node: true } }], // run by Node, not the browser
  rules: { "react/prop-types": "off" }, // no PropTypes in this project
};
