import type { RouteRecordRaw } from "vue-router"
import { commonPaths } from "@r/common/paths"
import { CommonRouteName } from "@r/common/route-names"
import LoginView from "@v/auth/auth-view.vue"

import { Roles } from "@/definitions/roles.ts"

const routes: RouteRecordRaw[] = [
    {
        path:      commonPaths.Auth,
        name:      CommonRouteName.Auth,
        component: LoginView,
        meta:      {
            roles: [Roles.UNAUTHORIZED],
        },
    },
    {
        path:      "/:pathMatch(.*)*",
        component: LoginView,
        meta:      {
            roles: [Roles.UNAUTHORIZED],
        },
    },
]

export default routes
