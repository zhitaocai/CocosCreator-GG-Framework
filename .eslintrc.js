module.exports = {
    root: true,

    /**
     * 解析器 
     * 
     * tells ESLint to use the parser package you installed (@typescript-eslint/parser)
     *
     * * This allows ESLint to understand TypeScript syntax.
     * * This is required, or else ESLint will throw errors as it tries to parse TypeScript code as if it were regular JavaScript.
     */
    parser: "@typescript-eslint/parser",

    /**
     * 插件
     * 
     * tells ESLint to load the plugin package you installed (@typescript-eslint/eslint-plugin).
     *
     * * This allows you to use the rules within your codebase.
     */
    plugins: ["@typescript-eslint"],

    /**
     * 扩展
     * 
     * tells ESLint that your config extends the given configurations
     */
    extends: [
        /**
         * ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
         */
        "eslint:recommended",

        /**
         * "recommended" config - it's just like eslint:recommended, except it only turns on rules from our TypeScript-specific plugin.
         */
        "plugin:@typescript-eslint/recommended",

        // 'prettier',
        // 'prettier/@typescript-eslint',

    ],
};
