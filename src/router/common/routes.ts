import type { RouteRecordRaw } from "vue-router"
import { commonPaths } from "@r/common/paths"
import { CommonRouteName } from "@r/common/route-names"
import GuestLayout from "@l/guest/GuestLayout.vue"
import LoginView from "@v/auth/auth-view.vue"

import { Roles } from "@/shared/roles/roles"

const routes: RouteRecordRaw[] = [
    {
        path:      commonPaths.Auth,
        name:      CommonRouteName.Auth,
        component: LoginView,
        meta:      {
            layout: GuestLayout,
            roles:  [Roles.UNAUTHORIZED],
        },
    },
    {
        path:      "/:pathMatch(.*)*",
        component: LoginView,
        meta:      {
            layout: GuestLayout,
            roles:  [Roles.UNAUTHORIZED],
        },
    },
]

export default routes
