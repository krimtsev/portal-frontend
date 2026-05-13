import rawEnv from "./env.js"
import { Partner } from "@/definitions/partner.ts"

export interface Env {
    app: {
        partner: Partner
        host:    string
        port:    number
    }
    api: string
}

const env: Env = rawEnv
export default env
