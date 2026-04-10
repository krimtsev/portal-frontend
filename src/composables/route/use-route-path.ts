import { useRoute, useRouter } from "vue-router"

export function useRoutePath() {
    const router = useRouter()
    const route = useRoute()

    async function pushMergeMath(path: string) {
        const currentPath = [route.params.pathMatch ?? []].flat()

        await router.push({
            name:   route.name,
            params: { pathMatch: [...currentPath, path] },
        })
    }

    async function pushMath(path: string | string[]) {
        let pathArray: string[] = []

        if (typeof path === "string") {
            pathArray = path
                .split("/")
                .filter(Boolean)
        } else if (Array.isArray(path)) {
            pathArray = path.filter(Boolean)
        }

        await router.push({
            name:   route.name,
            params: { pathMatch: pathArray },
        })
    }

    function getLastMatch() {
        const pathMatch = route.params.pathMatch
        if (Array.isArray(pathMatch)) {
            return pathMatch[pathMatch.length - 1]
        }
        return ""
    }

    return {
        pushMergeMath,
        pushMath,
        getLastMatch,
    }
}
