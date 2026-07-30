import type { RouteRecordRaw } from "vue-router"
import { commonPaths } from "@r/common/paths"
import { CommonRouteName } from "@r/common/route-names"
import LoginView from "@v/auth/auth-view.vue"
import MaintenanceView from "@v/maintenance/maintenance-view.vue"
import { Roles } from "@/definitions/roles"

const routes: RouteRecordRaw[] = [
    {
        path:      commonPaths.Auth,
        name:      CommonRouteName.Auth,
        component: LoginView,
        meta:      {
            roles:  [Roles.UNAUTHORIZED],
            layout: "guest-layout",
        },
    },
    {
        path:      commonPaths.Maintenance,
        name:      CommonRouteName.Maintenance,
        component: MaintenanceView,
        meta:      {
            roles:  [Roles.UNAUTHORIZED],
            layout: "guest-layout",
        },
    },
    {
        path:      "/:pathMatch(.*)*",
        component: LoginView,
        meta:      {
            roles:  [Roles.UNAUTHORIZED],
            layout: "guest-layout",
        },
    },
]

export default routes
