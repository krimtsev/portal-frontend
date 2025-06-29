import { defineConfig } from "eslint/config"

export default defineConfig({
    "root": true,

    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },

    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended", // Рекомендации для TypeScript
        "plugin:vue/vue3-recommended" // Рекомендации для Vue 3
    ],

    "parser": "@typescript-eslint/parser", // Указываем парсер для TypeScript

    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module" // Для использования импорта/экспорта
    },

    "plugins": [
        "@typescript-eslint", // Плагин для TypeScript
        "vue" // Плагин для Vue
    ],

    "rules": {
        "quotes":                                      ["warn", "double", { "avoidEscape": true }],
        "quote-props":                                 ["warn", "as-needed"],
        "semi":                                        ["warn", "never"],

        // vue
        "vue/max-attributes-per-line":                 ["error", { "singleline": 3, "multiline": 1 }],
        "vue/singleline-html-element-content-newline": "off",
        "vue/multi-word-component-names":              "off",
        "vue/no-unused-properties": ["error", {
            "groups": ["props"],
            "deepData": false,
            "ignorePublicMembers": false,
            "unreferencedOptions": []
        }],
        "vue/max-len":              ["warn", {
            code:                      120,
            ignoreComments:            true,
            ignoreRegExpLiterals:      true,
            ignoreStrings:             true,
            ignoreTemplateLiterals:    true,
            ignoreHTMLAttributeValues: true,
        }],
        "vue/no-multi-spaces": ["warn", {
            ignoreProperties: false,
        }],
        "vue-required-attributes/require-attributes": ["error", {
            "data-qa": ["itl-form-card", "dialog-section"],
        }],
        "vue/no-v-text-v-html-on-component": "off",
        "vue/no-v-html":                     "off",
        "vue/html-indent":                   ["warn", 4],
        "vue/this-in-template":              ["error", "never"],
        "vue/no-empty-component-block":      "warn",

        // custom rules
        "no-self-compare":             "error",
        "require-await":               "warn",
        "no-fallthrough":              "error",
        "no-nested-ternary":           "warn",
        "prefer-regex-literals":       "warn",
        "prefer-const":                "warn",
        "object-curly-spacing":        ["warn", "always"],
        "prefer-template":             "warn",
        "template-curly-spacing":      ["warn", "never"],
        "keyword-spacing":             ["warn", { before: true, after: true }],
        "space-infix-ops":             "warn",
        "space-before-blocks":         "warn",
        "space-in-parens":             "warn",
        "space-before-function-paren": ["warn", {
            named:      "never",
            anonymous:  "always",
            asyncArrow: "always",
        }],
        "no-multi-spaces": ["warn", {
            exceptions: {
                TSTypeAnnotation: true,
                Property:         true,
                Program:          true,
            },
        }],
        "no-spaced-func":                   "warn",

        "brace-style":                      "warn",
        "prefer-arrow-callback":            "warn",
        "no-unneeded-ternary":              "warn",
        "nonblock-statement-body-position": ["warn", "beside", { overrides: { while: "below" } }],

        "no-var":                  "warn",
        "no-multiple-empty-lines": ["warn", { max: 2 }],
        "key-spacing":             ["warn", { align: "value" }],
        "indent":                    [
            "warn",
            4,
            {
                ignoreComments: true,
                ignoredNodes:   [
                    "FunctionExpression > .params[decorators.length > 0]",
                    "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                    "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
                ],
            },
        ],
        "linebreak-style":          ["warn", "unix"],
        "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
        "comma-dangle":             ["warn", "always-multiline"],
        "newline-per-chained-call":                   ["warn", { ignoreChainWithDepth: 2 }],
        "no-prototype-builtins":                      "off",

        // "keyword-spacing": ["warn", { "before": true, "after": true }],
        "comma-spacing": "warn",
        "arrow-spacing": "warn",

        "unicorn/prefer-includes": "warn",

        "no-anonymous-object-types/no-anonymous-object-types":       "warn",
        "ref-decorator/ref-decorator":                               "error",
        "simplify-boolean-expressions/simplify-boolean-expressions": "warn",

        "no-unused-vars":                            "off",
        "@typescript-eslint/no-unused-vars":         ["warn"],
        "no-unused-expressions":                     "off",
        "@typescript-eslint/no-unused-expressions":  "error",
        "@typescript-eslint/array-type":             "warn",
        "@typescript-eslint/no-non-null-assertion":  "off",
        "@typescript-eslint/camelcase":              "off",
        "@typescript-eslint/member-delimiter-style": ["warn", {
            multiline: {
                delimiter: "none",
            },
            singleline: {
                delimiter: "comma",
            },
        }],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/naming-convention":       ["warn",
            {
                selector: "enum",
                format:   ["PascalCase"],
            },
            {
                selector:          "enumMember",
                format:            ["PascalCase", "UPPER_CASE"],
                leadingUnderscore: "allow",
            },
        ],

        "array-callback-return":             "warn",
    }
});
