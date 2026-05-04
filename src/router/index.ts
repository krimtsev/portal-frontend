import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
} from "vue-router"
import { useAppStore } from "@s/app/app"
import { useAuthStore } from "@s/auth/auth"
import { CommonRouteName } from "@r/common/route-names"
import { PortalRouteName } from "@r/portal/route-names"
import routes, { addCustomizationRoutes } from "@r/routes"
import i18n from "@/plugins/i18n"
import type { Roles } from "@/shared/roles/roles"

const router = createRouter({
    history: createWebHistory(),
    routes,
})

function setTitle(to: RouteLocationNormalized) {
    document.title = to.meta?.title
        ? i18n.global.t(to.meta.title)
        : i18n.global.t("mc.partner.title")
}

router.beforeEach(async (to: RouteLocationNormalized, _from, next) => {
    const appStore = useAppStore()
    const authStore = useAuthStore()

    setTitle(to)

    if (authStore.isLoading || !authStore.isAuthenticated) {
        if (to.name !== CommonRouteName.Auth) {
            if (to.fullPath === "/") {
                return next({ name: CommonRouteName.Auth })
            }

            return next({
                name:  CommonRouteName.Auth,
                query: { redirect: to.fullPath },
            })
        }

        return next()
    }

    if (authStore.isAuthenticated) {
        if (!appStore.isRoutesLoaded) {
            await addCustomizationRoutes(router)
            return next({ ...to, replace: true })
        }

        if (to.name === CommonRouteName.Auth || !to.name) {
            return next({ name: PortalRouteName.Home, replace: true })
        }

        const requiredRoles = to.meta?.roles as Roles[] | undefined
        const userRole = authStore.user?.role

        if (requiredRoles && !requiredRoles.includes(userRole)) {
            return next({ name: PortalRouteName.Home, replace: true })
        }
    } else {
        if (to.name !== CommonRouteName.Auth) {
            return next({ name: CommonRouteName.Auth, replace: true })
        }
    }

    next()
})

export default router
