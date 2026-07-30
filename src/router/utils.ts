import type { RouteLocationNormalized } from "vue-router"

export function getMeta(to: RouteLocationNormalized) {
    let result: { [key: string]: any } = {}
    to.matched.forEach(({ meta }) =>
        result = { ...result, ...meta },
    )
    return result
}
