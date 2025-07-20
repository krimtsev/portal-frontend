import rawEnv from "./env.js"

export type Partner = "britva" | "soda"

export interface Env {
    app: {
        partner: Partner
    }
    api: string
}

const env: Env = rawEnv
export default env
