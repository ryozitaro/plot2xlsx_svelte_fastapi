/**@type {import("prettier").Config} */
const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  singleQuote: true,
  jsxSingleQuote: true,
}

/**@type {import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const sortImport = {
  importOrder: ["^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderGroupNamespaceSpecifiers: true,
}

export default {
  ...config,
  ...sortImport,
}
