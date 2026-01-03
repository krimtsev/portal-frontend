import vue from "eslint-plugin-vue"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import vueParser from "vue-eslint-parser"
import unicorn from "eslint-plugin-unicorn" // ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            "semi": ["error", "never"],
            "quotes": ["warn", "double", { "avoidEscape": true }],
            "quote-props": ["warn", "as-needed"],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],
        },
    },
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsparser,
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            vue,
            "@typescript-eslint": tseslint,
        },
        rules: {
            "vue/max-attributes-per-line": ["error", { singleline: 3, multiline: 1 }],
            "vue/singleline-html-element-content-newline": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-unused-properties": ["error", {
                groups: ["props"],
                deepData: false,
                ignorePublicMembers: false,
                unreferencedOptions: []
            }],
            "vue/max-len": ["warn", {
                code: 120,
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreHTMLAttributeValues: true,
            }],
            "vue/no-multi-spaces": ["warn", { ignoreProperties: false }],
            "vue/no-v-text-v-html-on-component": "off",
            "vue/no-v-html": "off",
            "vue/html-indent": ["warn", 4],
            "vue/this-in-template": ["error", "never"],
            "vue/no-empty-component-block": "warn",
            "semi": ["error", "never"],
            "quotes": ["warn", "double", { "avoidEscape": true }],
            "quote-props": ["warn", "as-needed"],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],
            "no-unused-expressions": "error",
            "camelcase": "off",
            "array-callback-return": "warn"
        },
    },
    {
        files: ["**/*.{js,ts,vue}"],
        plugins: {
            unicorn,
        },
        rules: {
            quotes: ["warn", "double", { avoidEscape: true }],
            "quote-props": ["warn", "as-needed"],
            "object-curly-spacing": ["error", "always"],
            "unicorn/filename-case": [
                "error",
                {
                    cases: {
                        kebabCase: true,
                    },
                    ignore: [
                        "App.vue",
                        "DashboardLayout.vue",
                        "PortalLayout.vue",
                        "GuestLayout.vue"
                    ]
                },
            ],
        },
    },
]
