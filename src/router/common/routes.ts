import type { RouteRecordRaw } from "vue-router"
import { commonPaths } from "@r/common/paths"
import { CommonRouteName } from "@r/common/route-names"
import { Roles } from "@/shared/roles/roles"
import LoginView from "@v/auth/auth-view.vue"
import GuestLayout from "@l/guest/GuestLayout.vue"

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: GuestLayout,
        children: [
            {
                path:       commonPaths.Auth,
                name:       CommonRouteName.Auth,
                components: {
                    default:   LoginView,
                },
                meta: {
                    roles:  [Roles.UNAUTHORIZED],
                },
            },
        ]
    }
]

export default routes
