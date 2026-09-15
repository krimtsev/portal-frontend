import {
    type RouteLocationRaw,
    useRouter,
} from "vue-router"

export function useRouteNavigator() {
    const router = useRouter()

    const navigate = async (
        to: RouteLocationRaw,
        event?: MouseEvent,
    ) => {
        if (event?.ctrlKey || event?.metaKey) {
            const route = router.resolve(to)
            window.open(route.href, "_blank")
            return
        }

        await router.push(to)
    }

    return {
        navigate,
    }
}
