// module.exports = {
//     root: true,

//     /**
//      * 解析器：使用 ESLint 解析 TypeScript 语法
//      *
//      * tells ESLint to use the parser package you installed (@typescript-eslint/parser)
//      *
//      * * This allows ESLint to understand TypeScript syntax.
//      * * This is required, or else ESLint will throw errors as it tries to parse TypeScript code as if it were regular JavaScript.
//      */
//     parser: "@typescript-eslint/parser",

//     /**
//      * 插件
//      *
//      * tells ESLint to load the plugin package you installed (@typescript-eslint/eslint-plugin).
//      *
//      * * This allows you to use the rules within your codebase.
//      */
//     plugins: [

//         /**
//          * 在 ESLint 中加载此插件，用于配置 TypeScript 校验规则
//          */
//         // "@typescript-eslint"
//         "@typescript-eslint/eslint-plugin"
//     ],

//     /**
//      * 扩展
//      *
//      * tells ESLint that your config extends the given configurations
//      */
//     extends: [
//         /**
//          * ESLint 共享规则配置，此为 ESlint 内置的推荐校验规则配置（也被称为最佳规则实践）
//          *
//          * ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
//          */
//         "eslint:recommended",

//         /**
//          * "recommended" config - it's just like eslint:recommended, except it only turns on rules from our TypeScript-specific plugin.
//          */
//         "plugin:@typescript-eslint/recommended",

//         // 'prettier',
//         // 'prettier/@typescript-eslint',

//     ],
// };
//
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        // "eslint:recommended", "plugin:@typescript-eslint/recommended",
        "alloy",
        "alloy/typescript"
        // "prettier",
        // "prettier/@typescript-eslint"
    ]
    // rules: {
    //   // 禁止使用 var
    //   'no-var': "error",
    //   // 优先使用 interface 而不是 type
    //   '@typescript-eslint/consistent-type-definitions': [
    //       "error",
    //       "interface"
    //   ]
    // }
};
