/// <reference types="vite/client" />

declare module "virtual:partner" {
    const partnerContext: {
        name:          string
        host:          string
        port:          number
        api:           string
        [key: string]: any
    }
    export default partnerContext
}
