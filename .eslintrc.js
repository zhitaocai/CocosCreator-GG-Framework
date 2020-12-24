module.exports = {
    root: true,

    /**
     * 解析器：使用 ESLint 解析 TypeScript 语法
     *
     * tells ESLint to use the parser package you installed (@typescript-eslint/parser)
     *
     * * This allows ESLint to understand TypeScript syntax.
     * * This is required, or else ESLint will throw errors as it tries to parse TypeScript code as if it were regular JavaScript.
     */
    parser: "@typescript-eslint/parser",

    /**
     * ESLint 插件
     *
     * tells ESLint to load the plugin package you installed
     */
    plugins: [
        /**
         * 在 ESLint 中加载此插件，用于配置 TypeScript 校验规则
         */
        "@typescript-eslint",
    ],

    /**
     * 扩展
     *
     * tells ESLint that your config extends the given configurations
     */
    extends: [
        // ESLint 共享规则配置，此为 ESlint 内置的推荐校验规则配置（也被称为最佳规则实践）
        // ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
        // 当 ESLint 的原生规则`eslint:recommended` 和 `plugin:@typescript-eslint/recommended` 的规则太多了，而且原生的规则有一些在 TypeScript 中支持的不好，需要禁用掉。
        // "eslint:recommended",
        // "plugin:@typescript-eslint/recommended",

        // 因此最后采用 AlloyTeam 的 ESLintConfig
        // @see https://github.com/AlloyTeam/eslint-config-alloy
        "alloy",
        "alloy/typescript",

        // 格式化扩展
        // "prettier",
        // "prettier/@typescript-eslint"
    ],

    globals: {
        /**
         * 指定Cocos Creator相关全局变量，这样子就不会触发 no-undef 的规则
         */
        cc: "readonly",
        CC_JSB: "readonly",
        CC_NATIVERENDERER: "readonly",
        CC_EDITOR: "readonly",
        CC_PREVIEW: "readonly",
        CC_TEST: "readonly",
        CC_DEBUG: "readonly",
        Editor: "readonly",
    },
    /**
     * 默认规则
     *
     * @see https://eslint.org/docs/rules/
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules
     */
    rules: {
        /**
         * 禁止使用 var
         */
        "no-var": ["error"],

        eqeqeq: "off",
        "no-eq-null": "off",

        /**
         * 控制极限环复杂度最大值为25（默认20），超过后警告(默认是报错)
         */
        complexity: [
            "warn",
            {
                max: 25,
            },
        ],

        /**
         * 函数最多参数数量为 3 个（默认值），超过之后警告
         */
        "max-params": ["warn"],

        /**
         * 强制使用 interface 而不是 type 去定义对象类型
         */
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

        /**
         * method 和 property 不需要显式声明 public 访问修饰符
         */
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "no-public",
            },
        ],

        /**
         * 强制使用 method 签名语法而不是 property 签名语法
         */
        "@typescript-eslint/method-signature-style": ["error", "method"],

        /**
         * 强制使用 method 签名语法而不是 property 签名语法
         */
        "@typescript-eslint/member-ordering": ["off"],

        /**
         * 关闭 optional-chain 语法改进提示，因为 cc 支持的 ts 版本不够高，不能用该语法糖
         */
        "@typescript-eslint/prefer-optional-chain": ["off"],

        /**
         * 允许显式声明 number, string, boolean 的变量或参数值
         */
        "@typescript-eslint/no-inferrable-types": ["off"],

        "@typescript-eslint/consistent-type-assertions": ["off"],
    },

    // /**
    //  * 指定部分文件覆盖规则
    //  */
    // overrides: [
    //     {
    //         // enable the rule specifically for TypeScript files
    //         files: ["*.ts", "*.tsx"],
    //         rules: {
    //             "@typescript-eslint/explicit-member-accessibility": ["no-public"],
    //             // 强制使用 method 签名语法而不是 property 签名语法
    //             "@typescript-eslint/method-signature-style": ["method"],

    //             /**
    //              * 函数最多参数数量 4 个
    //              */
    //             "max-params": 4,
    //         },
    //     },
    // ],
};
