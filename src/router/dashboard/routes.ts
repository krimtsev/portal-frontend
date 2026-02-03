import type { RouteRecordRaw } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import { Roles } from "@/shared/roles/roles"
import DashboardLayout from "@l/dashboard/DashboardLayout.vue"
import PanelView from "@v/dashboard/panel/panel-view.vue"
import TicketsListView from "@v/dashboard/tickets/list/tickets-list-view.vue"
import TicketView from "@v/dashboard/tickets/edit/ticket-view.vue"
import UsersListView from "@v/dashboard/users/list/users-list-view.vue"
import UserView from "@v/dashboard/users/edit/user-view.vue"
import PartnersListView from "@v/dashboard/partners/list/partners-list-view.vue"
import PartnerView from "@v/dashboard/partners/edit/partner-view.vue"

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
                    breadcrumb: "mc.dashboard.sidebar.home"
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
                    breadcrumb: "mc.dashboard.sidebar.tickets"
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
                    breadcrumb: "mc.dashboard.sidebar.tickets"
                }
            },
            {
                path:      dashboardPaths.DashboardUsers,
                name:      DashboardRouteName.DashboardUsers,
                components: {
                    default: UsersListView,
                },
                meta: {
                    roles:  [Roles.SYSADMIN],
                    breadcrumb: "mc.dashboard.sidebar.users"
                }
            },
            {
                path:      dashboardPaths.DashboardUser,
                name:      DashboardRouteName.DashboardUser,
                components: {
                    default: UserView,
                },
                meta: {
                    roles:  [Roles.SYSADMIN],
                    breadcrumb: "mc.dashboard.sidebar.users"
                }
            },
            {
                path:      dashboardPaths.DashboardPartners,
                name:      DashboardRouteName.DashboardPartners,
                components: {
                    default: PartnersListView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                    breadcrumb: "mc.dashboard.sidebar.partners"
                }
            },
            {
                path:      dashboardPaths.DashboardPartner,
                name:      DashboardRouteName.DashboardPartner,
                components: {
                    default: PartnerView,
                },
                meta: {
                    roles:  [Roles.ADMIN, Roles.SYSADMIN],
                    breadcrumb: "mc.dashboard.sidebar.partner"
                }
            }
        ]
    },

]

export default routes
