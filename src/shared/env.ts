export type Partner = "britva" | "soda"

export interface Env {
    app: {
        partner: Partner
    }
    api: string
}
