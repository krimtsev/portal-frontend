import type { RouteRecordRaw } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import { Roles } from "@/shared/roles/roles"
import DashboardLayout from "@l/dashboard/DashboardLayout.vue"
import PanelView from "@v/dashboard/panel/panel-view.vue"
import TicketsListView from "@v/dashboard/tickets/list/tickets-list-view.vue"
import TicketView from "@v/dashboard/tickets/edit/ticket-view.vue"

const routes: RouteRecordRaw[] = [
    {
        path: dashboardPaths.Dashboard,
        component: DashboardLayout,
        redirect: {
            name: DashboardRouteName.DashboardPanel
        },
        meta: {
            title: "mc.partner.title"
        },
        children: [
            {
                path:      dashboardPaths.DashboardPanel,
                name:      DashboardRouteName.DashboardPanel,
                components: {
                    default: PanelView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path:      dashboardPaths.DashboardTickets,
                name:      DashboardRouteName.DashboardTickets,
                components: {
                    default: TicketsListView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path:      dashboardPaths.DashboardTicket,
                name:      DashboardRouteName.DashboardTicket,
                components: {
                    default: TicketView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                }
            }
        ]
    },

]

export default routes
