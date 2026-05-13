import type { RouteRecordRaw } from "vue-router"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { Roles } from "@/definitions/roles.ts"

const routes: RouteRecordRaw[] = [
    {
        path:      dashboardPaths.DashboardPanel,
        name:      DashboardRouteName.DashboardPanel,
        component: () => import("@v/dashboard/panel/panel-view.vue"),
        meta:      {
            roles:      [Roles.ADMIN, Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.home",
        },
    },
    {
        path:      dashboardPaths.DashboardTickets,
        name:      DashboardRouteName.DashboardTickets,
        component: () => import("@v/dashboard/tickets/list/tickets-list-view.vue"),
        meta:      {
            roles:      [Roles.ADMIN, Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.tickets",
        },
    },
    {
        path:      dashboardPaths.DashboardTicket,
        name:      DashboardRouteName.DashboardTicket,
        component: () => import("@v/dashboard/tickets/edit/ticket-view.vue"),
        meta:      {
            roles:      [Roles.ADMIN, Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.tickets",
        },
    },
    {
        path:      dashboardPaths.DashboardUsers,
        name:      DashboardRouteName.DashboardUsers,
        component: () => import("@v/dashboard/users/list/users-list-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.users",
        },
    },
    {
        path:      dashboardPaths.DashboardUser,
        name:      DashboardRouteName.DashboardUser,
        component: () => import("@v/dashboard/users/edit/user-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.users",
        },
    },
    {
        path:      dashboardPaths.DashboardPartners,
        name:      DashboardRouteName.DashboardPartners,
        component: () => import("@v/dashboard/partners/list/partners-list-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.partners",
        },
    },
    {
        path:      dashboardPaths.DashboardPartner,
        name:      DashboardRouteName.DashboardPartner,
        component: () => import("@v/dashboard/partners/edit/partner-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.partners",
        },
    },
    {
        path:      dashboardPaths.DashboardPartnerGroups,
        name:      DashboardRouteName.DashboardPartnerGroups,
        component: () => import("@v/dashboard/partner-groups/list/partner-groups-list-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.partners",
        },
    },
    {
        path:      dashboardPaths.DashboardPartnerGroup,
        name:      DashboardRouteName.DashboardPartnerGroup,
        component: () => import("@v/dashboard/partner-groups/edit/partner-groups-view.vue"),
        meta:      {
            roles:      [Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.partners",
        },
    },
    {
        path:      dashboardPaths.DashboardCloudList,
        name:      DashboardRouteName.DashboardCloudList,
        component: () => import("@v/dashboard/cloud/list/cloud-list-view.vue"),
        meta:      {
            roles:      [Roles.ADMIN, Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.cloud",
        },
    },
    {
        path:      dashboardPaths.DashboardCloud,
        name:      DashboardRouteName.DashboardCloud,
        component: () => import("@v/dashboard/cloud/edit/cloud-view.vue"),
        meta:      {
            roles:      [Roles.ADMIN, Roles.SYSADMIN],
            breadcrumb: "mc.dashboard.sidebar.cloud",
        },
    },
]

export default routes
