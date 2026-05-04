import type { Router, RouteRecordRaw } from "vue-router"
import { useAppStore } from "@s/app/app"
import commonRoutes from "@r/common/routes"

interface Customization {
    hasDashboard?: boolean
    isBritva?:     boolean
    isSoda?:       boolean
}

const getProfileRoutes = () => import(/* webpackChunkName: "profile-routes" */ "@r/profile/routes")
const getPortalRoutes = () => import(/* webpackChunkName: "portal-routes" */ "@r/portal/routes")
const getDashboardRoutes = () => import(/* webpackChunkName: "dashboard-routes" */ "@r/dashboard/routes")

const getBritvaRoutes = () => import(/* webpackChunkName: "portal-britva" */ "@r/portal/_britva/routes")
const getSodaRoutes = () => import(/* webpackChunkName: "portal-soda" */ "@r/portal/_soda/routes")

async function lazyLoadRoutes(customization: Customization): Promise<RouteRecordRaw[]> {
    const customizationRoutes: RouteRecordRaw[] = []

    const [profileModule, portalModule] = await Promise.all([
        getProfileRoutes(),
        getPortalRoutes(),
    ])

    customizationRoutes.push(...(profileModule.default || profileModule))
    customizationRoutes.push(...(portalModule.default || portalModule))

    if (customization.isBritva) {
        const module = await getBritvaRoutes()
        customizationRoutes.push(...(module.default || module))
    } else if (customization.isSoda) {
        const module = await getSodaRoutes()
        customizationRoutes.push(...(module.default || module))
    }

    // TODO: Переделать на динамическое добавление роутов для админа
    // if (customization.hasDashboard) {}
    const module = await getDashboardRoutes()
    customizationRoutes.push(...(module.default || module))

    return customizationRoutes
}

export async function addCustomizationRoutes(router: Router) {
    const appStore = useAppStore()

    const customization: Customization = {
        hasDashboard: appStore.hasDashboard,
        isBritva:     appStore.isBritva,
        isSoda:       appStore.isSoda,
    }

    const routes = await lazyLoadRoutes(customization)

    routes.forEach(route => {
        router.addRoute(route)
    })

    appStore.setRoutesLoaded(true)
}

export default commonRoutes
