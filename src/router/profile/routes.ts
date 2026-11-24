import type { RouteRecordRaw } from "vue-router"
import { profilePaths } from "@r/profile/path"
import { ProfileRouteName } from "@r/profile/route-names"
import { Partner } from "@/definitions/partner"


const routes: RouteRecordRaw[] = [
    {
        path:      profilePaths.Profile,
        name:      ProfileRouteName.Profile,
        component: () => import("@v/profile/profile-view.vue"),
    },
    {
        path:      profilePaths.ProfileUserProfile,
        name:      ProfileRouteName.ProfileUserProfile,
        component: () => import("@v/profile/user-profile/user-profile-view.vue"),
    },
    {
        path:      profilePaths.ProfileChangePassword,
        name:      ProfileRouteName.ProfileChangePassword,
        component: () => import("@v/profile/change-password/change-password-view.vue"),
    },
    {
        path:      profilePaths.ProfileStatisticsStaff,
        name:      ProfileRouteName.ProfileStatisticsStaff,
        component: () => import("@v/profile/statistics/staff-statistics/staff-statistics-view.vue"),
    },
    {
        path:      profilePaths.ProfileTelnumsIncoming,
        name:      ProfileRouteName.ProfileTelnumsIncoming,
        component: () => import("@v/profile/telnums-incoming/telnums-incoming-view.vue"),
    },
    {
        path:      profilePaths.ProfileTeam,
        name:      ProfileRouteName.ProfileTeam,
        component: () => import("@v/profile/team/team-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicket,
        name:      ProfileRouteName.ProfileTicket,
        component: () => import("@v/profile/tickets/edit/ticket-edit-view.vue"),
    },
    {
        path:      profilePaths.ProfileTickets,
        name:      ProfileRouteName.ProfileTickets,
        component: () => import("@v/profile/tickets/list/tickets-list-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketGeneral,
        name:      ProfileRouteName.ProfileTicketGeneral,
        component: () => import("@v/profile/tickets/create/general/general-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketDesign,
        name:      ProfileRouteName.ProfileTicketDesign,
        component: () => import("@v/profile/tickets/create/design/design-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketCertificate,
        name:      ProfileRouteName.ProfileTicketCertificate,
        component: () => import("@v/profile/tickets/create/certificate/certificate-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketSpecialist,
        name:      ProfileRouteName.ProfileTicketSpecialist,
        component: () => import("@v/profile/tickets/create/specialist/specialist-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketBlacklist,
        name:      ProfileRouteName.ProfileTicketBlacklist,
        component: () => import("@v/profile/tickets/create/blacklist/blacklist-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketFlagman,
        name:      ProfileRouteName.ProfileTicketFlagman,
        component: () => import("@v/profile/tickets/create/flagman/flagman-create.view.vue"),
        meta:      {
            partners: [Partner.Britva, Partner.Soda],
        },
    },
    {
        path:      profilePaths.ProfileTicketAdministrator,
        name:      ProfileRouteName.ProfileTicketAdministrator,
        component: () => import("@v/profile/tickets/create/administrator/administrator-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketOpening,
        name:      ProfileRouteName.ProfileTicketOpening,
        component: () => import("@v/profile/tickets/create/opening/opening-create-view.vue"),
    },
    {
        path:      profilePaths.ProfileTicketMakeup,
        name:      ProfileRouteName.ProfileTicketMakeup,
        component: () => import("@v/profile/tickets/create/makeup/makeup-create-view.vue"),
        meta:      {
            partners: [Partner.Soda],
        },
    },
    {
        path:      profilePaths.ProfileTicketPodiatrist,
        name:      ProfileRouteName.ProfileTicketPodiatrist,
        component: () => import("@v/profile/tickets/create/podiatrist/podiatrist-create-view.vue"),
        meta:      {
            partners: [Partner.Soda],
        },
    },
    {
        path:      profilePaths.ProfileBankDetails,
        name:      ProfileRouteName.ProfileBankDetails,
        component: () => import("@v/profile/bank-details/list/bank-details-list-view.vue"),
    },
    {
        path:      profilePaths.ProfileBankDetail,
        name:      ProfileRouteName.ProfileBankDetail,
        component: () => import("@v/profile/bank-details/edit/bank-detail-view.vue"),
    },
]

export default routes
