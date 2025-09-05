import type { RouteRecordRaw } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import { Roles } from "@/shared/roles/roles"
import DashboardLayout from "@l/dashboard/DashboardLayout.vue"
import DashboardPanelView from "@v/dashboard/panel/panel-view.vue"

const routes: RouteRecordRaw[] = [
    {
        path: dashboardPaths.Dashboard,
        component: DashboardLayout,
        redirect: {
            name: DashboardRouteName.DashboardPanel
        },
        meta: {
            title: "mc.partner.name"
        },
        children: [
            {
                path:      dashboardPaths.Panel,
                name:      DashboardRouteName.DashboardPanel,
                components: {
                    default: DashboardPanelView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                }
            }
        ]
    },

]

export default routes
