import {
    createWebHistory,
    createRouter,
    type RouteLocationNormalized
} from "vue-router"
import routes from "@r/routes"
import useAuthStore from "~/src/store/auth/auth"
import { CommonRouteName } from "@r/common/route-names"
import { portalPaths } from "@r/portal/path"
import i18n from "@/plugins/i18n"

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to: RouteLocationNormalized, from, next) => {
    console.log({ to, from })

    if (to.meta?.title) {
        const { t } = i18n.global
        document.title = t(to.meta.title)
    }

    const authStore = useAuthStore()

    if (authStore.isLoading) {
        const result = await authStore.getUserData(true)
        if (!result) {
            return next({ name: CommonRouteName.Auth })
        }
    }

    if (authStore.isAuthenticated) {
        if (to.name === CommonRouteName.Auth || !to.name) {
            return next({ path: portalPaths.Home })
        }

        if (to.meta?.roles && !to.meta.roles.includes(authStore.user.role)) {
            return next({ name: CommonRouteName.Auth })
        }
    }

    if (!to.matched.length) {
        return next({ path: "/" })
    }

    next()
})

export default router
