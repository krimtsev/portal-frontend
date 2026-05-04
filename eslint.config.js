import vue from "eslint-plugin-vue"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import vueParser from "vue-eslint-parser"
import unicorn from "eslint-plugin-unicorn"
import stylistic from "@stylistic/eslint-plugin"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default [
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "builder/**",
            "lefthook/**",
            "**/locales/**/*.json",
            ".generated/**",
            "tsconfig.json",
            "eslint.config.js",
            ".idea/**",
            ".vscode/**",
        ],
    },
    {
        files:           ["**/*.ts"],
        languageOptions: {
            parser:        tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType:  "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "simple-import-sort": simpleImportSort
        },
        rules: {
            "no-unused-vars":                    "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],
            // "simple-import-sort/imports": [
            //     "error",
            //     {
            //         groups: [[
            //             "^zod",
            //             "vue-router",
            //             "^@s/",
            //             "^@?\\w",
            //             "^@/lib/",
            //             "^@/composables/",
            //             "^@c/",
            //             "^@v/",
            //             "^\\u0000", "^\\."
            //         ]]
            //     }
            // ],
        },
    },
    {
        files:           ["**/*.vue"],
        languageOptions: {
            parser:        vueParser,
            parserOptions: {
                parser:      tsparser,
                ecmaVersion: "latest",
                sourceType:  "module",
            },
        },
        plugins: {
            vue,
            "@typescript-eslint": tseslint,
            "simple-import-sort": simpleImportSort
        },
        rules: {
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [[
                        "^vue", "^@?\\w",        // 1. Библиотеки
                        "@s/",                   // 2. Store
                        "^@/composables/",       // 3. Composables
                        "^@r/",                  // 4. Routes
                        "^@/api", "^@/api/",     // 5. API
                        "@l/",                   // 6. Layout
                        "^@c/",                  // 7. Components
                        "^@v/",                  // 8. Views/Definitions
                        "@/lib",                 // 9. libs
                        "@/", "^\\u0000", "^\\." // 10. Типы и относительные пути
                    ]]
                }
            ],
            // Vue Layout & Formatting
            "vue/max-attributes-per-line": ["error", {
                singleline: {
                    max: 2,
                },
                multiline: {
                    max: 1,
                },
            }],
            "vue/multiline-html-element-content-newline":  "error",
            "vue/singleline-html-element-content-newline": "off",
            "vue/html-indent":                             ["warn", 4],
            "vue/html-closing-bracket-newline":            ["error", {
                singleline: "never",
                multiline:  "always",
            }],
            "vue/html-closing-bracket-spacing": ["error", {
                startTag:       "never",
                endTag:         "never",
                selfClosingTag: "always",
            }],
            "vue/html-self-closing": ["error", {
                html: {
                    void:      "never",
                    normal:    "always",
                    component: "always",
                },
                svg:  "always",
                math: "always",
            }],
            "vue/no-multi-spaces": ["error", {
                ignoreProperties: false,
            }],

            // Vue Essentials
            "vue/multi-word-component-names": "off",
            "vue/attribute-hyphenation":      "error",
            "vue/prop-name-casing":           "error",
            "vue/no-unused-properties":       ["error", {
                groups:              ["props"],
                deepData:            false,
                ignorePublicMembers: false,
                unreferencedOptions: [],
            }],
            "vue/max-len": ["error", {
                code:                      120,
                ignoreComments:            true,
                ignoreRegExpLiterals:      true,
                ignoreStrings:             true,
                ignoreTemplateLiterals:    true,
                ignoreHTMLAttributeValues: true,
            }],
            "vue/no-side-effects-in-computed-properties": "error",
            "vue/prefer-import-from-vue":                 "error",
            "vue/no-v-text-v-html-on-component":          "off",
            "vue/no-v-html":                              "off",
            "vue/this-in-template":                       ["error", "never"],
            "vue/no-empty-component-block":               "warn",
            "vue/no-unused-components":                   "error",
            "vue/no-unused-vars":                         "error",
            "vue/require-v-for-key":                      "error",
            "vue/require-default-prop":                   "error",
            "vue/no-use-v-if-with-v-for":                 "error",
            "vue/no-mutating-props":                      "error",
            "vue/require-prop-types":                     "error",
            "vue/component-definition-name-casing":       "error",
            "vue/no-async-in-computed-properties":        "error",
            "vue/no-ref-as-operand":                      "error",
            "vue/no-deprecated-delete-set":               "error",
            "vue/prefer-use-template-ref":                "error",

            // Vue Composition API
            "vue/define-macros-order": ["error", {
                order:            ["defineModel", "defineEmits", "defineProps", "defineSlots"],
                defineExposeLast: false,
            }],
            "vue/block-order": ["error", {
                order: ["script", "template", "style"],
            }],
            "vue/block-lang": ["error", {
                script: {
                    lang: "ts",
                },
            }],
            "vue/component-api-style":      ["error", ["script-setup"]],
            "vue/define-props-declaration": ["error", "type-based"],

            // JS/TS in Vue
            "no-unused-vars":                    "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],
            "no-unused-expressions": "error",
            camelcase:               "off",
            "array-callback-return": "error",
        },
    },
    {
        files:   ["**/*.{js,ts,vue}"],
        plugins: {
            unicorn,
            "@stylistic": stylistic,
        },
        rules: {
            // General Style
            semi:   ["error", "never"],
            quotes: ["error", "double", {
                avoidEscape: true,
            }],
            "quote-props":          ["error", "as-needed"],

            // General Logic
            "no-control-regex": "error",
            "id-match":         ["error", "^[^а-яА-ЯёЁ]+$", {
                properties: true,
            }],
            "no-self-compare":       "error",
            "require-await":         "error",
            "no-fallthrough":        "error",
            "no-nested-ternary":     "error",
            "no-unneeded-ternary":   "error",
            "prefer-regex-literals": "error",
            "prefer-const":          "error",
            "prefer-template":       "error",
            "array-callback-return": "error",

            // Spacing & Alignment
            "keyword-spacing":        ["error", {
                before: true,
                after:  true,
            }],
            "space-infix-ops":             "error",
            "space-before-blocks":         "error",
            "space-in-parens":             "error",
            "space-before-function-paren": ["error", {
                named:      "never",
                anonymous:  "always",
                asyncArrow: "always",
            }],

            // Layout
            "prefer-arrow-callback":   "error",
            "no-var":                  "error",
            "no-multiple-empty-lines": ["error", {
                max: 2,
            }],
            "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
            "newline-per-chained-call": ["error", {
                ignoreChainWithDepth: 2,
            }],

            // Unicorn
            "unicorn/filename-case": ["error", {
                cases: {
                    kebabCase: true,
                },
                ignore: [
                    "App.vue",
                    "DashboardLayout.vue",
                    "PortalLayout.vue",
                    "GuestLayout.vue",
                ],
            }],

            // Stylistic
            "@stylistic/function-call-spacing":   "error",
            "@stylistic/space-infix-ops":         "error",
            "@stylistic/type-annotation-spacing": "error",
            "@stylistic/type-generic-spacing":    "error",
            "@stylistic/member-delimiter-style":  ["error", {
                multiline: {
                    delimiter: "none",
                },
                singleline: {
                    delimiter: "comma",
                },
            }],
            "@stylistic/array-bracket-spacing": ["error", "never"],
            "@stylistic/arrow-spacing":         ["error", {
                before: true,
                after:  true,
            }],
            "@stylistic/block-spacing": "error",
            "@stylistic/brace-style":   "error",
            "@stylistic/comma-dangle":  ["error", "always-multiline"],
            "@stylistic/key-spacing":   ["error", {
                align: "value",
            }],
            "@stylistic/no-multi-spaces": ["error", {
                exceptions: {
                    TSTypeAnnotation: true,
                    Property:         true,
                    Program:          true,
                },
            }],
            "@stylistic/indent": ["error", 4, {
                ignoreComments: true,
                SwitchCase:     1,
                ignoredNodes:   [
                    "VariableDeclarator > ConditionalExpression",
                    "VariableDeclarator > LogicalExpression",
                ],
            }],
            "@stylistic/comma-spacing":   "error",
            "@stylistic/dot-location":    ["error", "property"],
            "@stylistic/linebreak-style": ["error", "unix"],
            "@stylistic/nonblock-statement-body-position": ["error", "beside", {
                overrides: {
                    while: "below",
                },
            }],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/template-curly-spacing": ["error", "never"],

            //"@stylistic/no-extra-semi":   "error",

            // Custom rules
            //"no-irregular-whitespace": "error",
            //"no-anonymous-object-types/no-anonymous-object-types": "error",
            //"simplify-boolean-expressions/simplify-boolean-expressions": "error",
            //"no-global-properties/no-global-properties": "error",
            //"no-reactive-reassignment/no-reactive-reassignment": "error",
        },
    },
]
