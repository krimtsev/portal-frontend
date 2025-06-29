import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import ProfileHomeView from "@v/portal/home/home-view.vue"
import PortalLayout from "@l/portal/PortalLayout.vue"


const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        redirect: {
            name: PortalRouteName.PortalHome
        },
        children: [
            {
                path: portalPaths.Home,
                name: PortalRouteName.PortalHome,
                components: {
                    default: ProfileHomeView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
        ]
    }
]

export default routes
