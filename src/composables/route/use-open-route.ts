import {
    useRouter,
    type RouteLocationRaw
} from "vue-router"

export function useOpenRoute() {
    const router = useRouter()

    const openRoute = async (
        to: RouteLocationRaw,
        event?: MouseEvent
    ) => {
        if (event?.ctrlKey || event?.metaKey) {
            const route = router.resolve(to)
            window.open(route.href, "_blank")
            return
        }

        await router.push(to)
    }

    return {
        openRoute
    }
}
