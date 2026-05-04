import type { RouteRecordRaw } from "vue-router"
import { profilePaths } from "@r/profile/path"
import { ProfileRouteName } from "@r/profile/route-names"
import { Roles } from "@/shared/roles/roles"


const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      profilePaths.Profile,
        name:      ProfileRouteName.Profile,
        component: () => import("@v/profile/profile-list/profile-list-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileUserProfile,
        name:      ProfileRouteName.ProfileUserProfile,
        component: () => import("@v/profile/user-profile/user-profile-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileChangePassword,
        name:      ProfileRouteName.ProfileChangePassword,
        component: () => import("@v/profile/change-password/change-password-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileAnalytics,
        name:      ProfileRouteName.ProfileAnalytics,
        component: () => import("@v/profile/analytics/analytics-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTeam,
        name:      ProfileRouteName.ProfileTeam,
        component: () => import("@v/profile/team/team-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicket,
        name:      ProfileRouteName.ProfileTicket,
        component: () => import("@v/profile/tickets/edit/ticket-edit-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTickets,
        name:      ProfileRouteName.ProfileTickets,
        component: () => import("@v/profile/tickets/list/tickets-list-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketGeneral,
        name:      ProfileRouteName.ProfileTicketGeneral,
        component: () => import("@v/profile/tickets/create/general/general-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketDesign,
        name:      ProfileRouteName.ProfileTicketDesign,
        component: () => import("@v/profile/tickets/create/design/design-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketCertificate,
        name:      ProfileRouteName.ProfileTicketCertificate,
        component: () => import("@v/profile/tickets/create/certificate/certificate-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketSpecialist,
        name:      ProfileRouteName.ProfileTicketSpecialist,
        component: () => import("@v/profile/tickets/create/specialist/_britva/specialist-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketBlacklist,
        name:      ProfileRouteName.ProfileTicketBlacklist,
        component: () => import("@v/profile/tickets/create/blacklist/blacklist-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketFlagman,
        name:      ProfileRouteName.ProfileTicketFlagman,
        component: () => import("@v/profile/tickets/create/flagman/flagman-create.view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketAdministrator,
        name:      ProfileRouteName.ProfileTicketAdministrator,
        component: () => import("@v/profile/tickets/create/administrator/_britva/administrator-create-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      profilePaths.ProfileTicketOpening,
        name:      ProfileRouteName.ProfileTicketOpening,
        component: () => import("@v/profile/tickets/create/opening/opening-create-view.vue"),
        meta:      {
            roles,
        },
    },
]

export default routes
