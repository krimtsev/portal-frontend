import path from "node:path"
import vue from "@vitejs/plugin-vue"
import envConfig from "./../env.js"
import { partnerPlugin } from "./partner-plugin.js"

export function createPartnerConfig(partnerName, mode = "development") {
    const partnerConfig = envConfig[partnerName]

    console.log(`[VITE CONFIG] partner=${partnerName} mode=${mode}`)

    if (!partnerConfig) {
        throw new Error(`❌ Конфигурация для партнера "${partnerName}" не найдена`)
    }

    const rootDir = process.cwd()
    const partnerGeneratedDir = path.resolve(rootDir, ".build", partnerName)
    const partnerAssetsDir = path.resolve(partnerGeneratedDir, "assets")

    return {
        configFile: false,
        clearScreen: false,

        mode,
        root: rootDir,
        cacheDir: path.resolve(rootDir, ".temp_cache", partnerName),
        publicDir: path.resolve(rootDir, "public", "partner", partnerName),

        plugins: [
            vue(),
            partnerPlugin(partnerName, partnerConfig)
        ],

        resolve: {
            alias: {
                "~":  path.resolve(rootDir),
                "@":  path.resolve(rootDir, "src"),
                "@l": path.resolve(rootDir, "src", "layouts"),
                "@c": path.resolve(rootDir, "src", "components"),
                "@v": path.resolve(rootDir, "src", "views"),
                "@r": path.resolve(rootDir, "src", "router"),
                "@s": path.resolve(rootDir, "src", "store"),
                "@h": path.resolve(rootDir, "src", "hooks"),
                "@a": partnerAssetsDir,
            },
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "@a/styles/_variables.scss" as *;
                        @use "@a/styles/_gradients.scss" as *;
                        @use "@a/styles/_typography.scss" as *;
                        @use "@a/styles/_mixins.scss" as *;
                    `,
                },
            },
        },

        build: {
            cssCodeSplit: true,
            outDir:       path.resolve(rootDir, "dist", partnerName),
            assetsDir:    "assets",
            emptyOutDir:  true,

            rollupOptions: {
                output: {
                    entryFileNames: "assets/js/[name]-[hash].js",
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    assetFileNames: (assetInfo) => {
                        const info = assetInfo.originalFileName || assetInfo.name || ""

                        if (/\.(woff|woff2|eot|ttf|otf)$/.test(info)) {
                            return "assets/fonts/[name]-[hash].[ext]"
                        }
                        if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
                            return "assets/images/[name]-[hash].[ext]"
                        }
                        if (/\.css$/.test(info)) {
                            return "assets/css/[name]-[hash].[ext]"
                        }
                        // На всякий случай для остальных файлов
                        return "assets/[name]-[hash].[ext]"
                    },
                },
            },
        },

        server: {
            host:  partnerConfig.host,
            port:  partnerConfig.port,
            cors:  false,
            proxy: {
                "/api": {
                    target:       partnerConfig.api,
                    changeOrigin: true,
                },
            },

            watch: {
                ignored: [
                    "**/.build/**",
                    "**/.temp_cache/**",
                    "**/dist/**",
                    "**/node_modules/**"
                ],
            },
        },
    }
}
