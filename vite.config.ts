import path from "node:path"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import envConfig from "./env"

export default ({ mode }: { mode: string }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd()),
    }

    const partnerName = process.env.VITE_APP_PARTNER || Object.keys(envConfig)[0]
    const partnerConfig = envConfig[partnerName]

    if (!partnerConfig) {
        throw new Error(`❌ Конфигурация для партнера "${partnerName}" не найдена в env.js`)
    }

    const isProd = mode === "production" || process.env.NODE_ENV === "production"
    const generatedBaseDirName = isProd ? ".prod" : ".dev"

    const partnerGeneratedDir = path.resolve(__dirname, generatedBaseDirName, partnerName)
    const partnerAssetsDir = path.resolve(partnerGeneratedDir, "assets")

    console.log(partnerAssetsDir)

    // https://vite.dev/config/
    return defineConfig({
        mode,

        publicDir: path.resolve(__dirname, "public", "partner", partnerName),

        plugins: [
            vue(),
        ],

        resolve: {
            alias: {
                "~":  path.resolve(__dirname),
                "@":  path.resolve(__dirname, "src"),
                "@l": path.resolve(__dirname, "src", "layouts"),
                "@c": path.resolve(__dirname, "src", "components"),
                "@v": path.resolve(__dirname, "src", "views"),
                "@r": path.resolve(__dirname, "src", "router"),
                "@s": path.resolve(__dirname, "src", "store"),
                "@h": path.resolve(__dirname, "src", "hooks"),
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
            outDir:       path.resolve(__dirname, "dist", partnerName),
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
                "/api/v1": {
                    target:       partnerConfig.api,
                    changeOrigin: true,
                },
            },
        },
    })
}


