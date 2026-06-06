import rawEnv from "./env.js"
import { Partner } from "@/definitions/partner"

export interface PartnerConfig {
    host: string
    port: number
    api:  string
}

export type Env = Record<Partner, PartnerConfig>

const env: Env = rawEnv
export default env
