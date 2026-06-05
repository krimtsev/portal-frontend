import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/definitions/roles"

const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_soda/home-view.vue"),
        meta:      {
            roles,
        },
    },
]

export default routes
