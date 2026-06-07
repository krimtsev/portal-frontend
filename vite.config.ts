import { defineConfig } from "vite"
// @ts-ignore
import envConfig from "./env.js"
// @ts-ignore
import { createPartnerConfig } from "./builder/partner-config.js"

export default ({ mode }: { mode: string }) => {
    const defaultPartner = Object.keys(envConfig)[0]

    return defineConfig(createPartnerConfig(defaultPartner, mode))
}
