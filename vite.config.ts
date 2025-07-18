import path from "node:path"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { PrimeVueResolver } from "@primevue/auto-import-resolver"


export default ({ mode }: { mode: never }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd())
    };

    // https://vite.dev/config/
    return defineConfig({
        mode,

        plugins: [
            vue(),
            Components({
                resolvers: [
                    PrimeVueResolver()
                ]
            })
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
                "@a": path.resolve(__dirname, ".generated", "assets"),
            },
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "@a/styles/_fonts.scss" as *;
                        @use "@a/styles/_mixins.scss" as *;
                        @use "@a/styles/_variables.scss" as *;
                    `
                },
            },
        },

        build: {
            cssCodeSplit: true,
            outDir: "dist",
            assetsDir: "assets",
        },

        server: {
            host: 'localhost',
            port: 8001,
            cors: false,
        },
    })
}



