import rawEnv from "./env.js"
import { Partner } from "@/shared/partner/partner"

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
