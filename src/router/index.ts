import { createWebHistory, createRouter } from "vue-router"
import routes from "@r/routes"
import useAuthStore from "~/src/store/auth/auth"
import { CommonRouteName } from "@r/common/route-names"
import { portalPaths } from "@r/portal/path"
// import { dashboardPaths } from "@r/dashboard/path"

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    console.log({
        to,
        from,
        next
    })

    const authStore = useAuthStore()

    console.log(authStore)
    if (authStore.isLoading) {
        const result = await authStore.getUserData(true)
        if (!result) {
            return next({ name: CommonRouteName.Auth })
        }
    }

    if (authStore.isAuthenticated) {
        if (to.name === CommonRouteName.Auth) {
            return next({ path: portalPaths.Home })
        }

        if (to.meta && Array.isArray(to.meta.roles)) {
            if (!to.meta.roles.includes(authStore.user.role)) {
                return next({ name: CommonRouteName.Auth })
            }
        }
    }

    // Проверка, что маршрут существует
    if (!to.matched.length) {
        // if (to.path.startsWith(portalPaths.Portal)) {
        //     return next({ path: portalPaths.Portal })
        // } else if (to.path.startsWith(dashboardPaths.Dashboard)) {
        //     return next({ path: dashboardPaths.Dashboard })
        // }
        return next({ path: '/' })
    }

    next()
})

export default router
