import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import PortalLayout from "@l/portal/PortalLayout.vue"


const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        meta: {
            title: "mc.partner.name"
        },
        redirect: {
            name: PortalRouteName.Home
        },
        children: [
        ]
    }
]

export default routes
