import type { RouteRecordRaw } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"
import PortalLayout from "@l/portal/PortalLayout.vue"
import { Roles } from "@/shared/roles/roles"
import { profilePaths } from "@r/profile/path"
import ProfileListView from "@v/profile/profile-list/profile-list-view.vue"
import UserProfileView from "@v/profile/user-profile/user-profile-view.vue"
import TeamView from "@v/profile/team/team-view.vue"
import ChangePasswordView from "@v/profile/change-password/change-password-view.vue"
import AnalyticsView from "@v/profile/analytics/analytics-view.vue"
import TicketEditView from "@v/profile/tickets/edit/ticket-edit-view.vue"
import TicketsListView from "@v/profile/tickets/list/tickets-list-view.vue"
import TicketCreateGeneralView from "@v/profile/tickets/create/general/general-create-view.vue"
import TicketCreateDesignView from "@v/profile/tickets/create/design/design-create-view.vue"
import TicketCreateCertificateView from "@v/profile/tickets/create/certificate/certificate-create-view.vue"
import TicketCreateSpecialistView from "@v/profile/tickets/create/specialist/_britva/specialist-create-view.vue"
import TicketCreateBlacklistView from "@v/profile/tickets/create/blacklist/blacklist-create-view.vue"
import TicketCreateFlagmanView from "@v/profile/tickets/create/flagman/flagman-create.view.vue"
import TicketCreateAdministratorView from "@v/profile/tickets/create/administrator/_britva/administrator-create-view.vue"


const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        meta: {
            title: "mc.partner.title"
        },
        children: [
            {
                path: profilePaths.Profile,
                name: ProfileRouteName.Profile,
                components: {
                    default: ProfileListView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileUserProfile,
                name: ProfileRouteName.ProfileUserProfile,
                components: {
                    default: UserProfileView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileChangePassword,
                name: ProfileRouteName.ProfileChangePassword,
                components: {
                    default: ChangePasswordView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileAnalytics,
                name: ProfileRouteName.ProfileAnalytics,
                components: {
                    default: AnalyticsView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileTeam,
                name: ProfileRouteName.ProfileTeam,
                components: {
                    default: TeamView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileTicket,
                name: ProfileRouteName.ProfileTicket,
                components: {
                    default: TicketEditView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileTickets,
                name: ProfileRouteName.ProfileTickets,
                components: {
                    default: TicketsListView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: profilePaths.ProfileTicketGeneral,
                name: ProfileRouteName.ProfileTicketGeneral,
                components: {
                    default: TicketCreateGeneralView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketDesign,
                name: ProfileRouteName.ProfileTicketDesign,
                components: {
                    default: TicketCreateDesignView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketCertificate,
                name: ProfileRouteName.ProfileTicketCertificate,
                components: {
                    default: TicketCreateCertificateView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketSpecialist,
                name: ProfileRouteName.ProfileTicketSpecialist,
                components: {
                    default: TicketCreateSpecialistView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketBlacklist,
                name: ProfileRouteName.ProfileTicketBlacklist,
                components: {
                    default: TicketCreateBlacklistView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketFlagman,
                name: ProfileRouteName.ProfileTicketFlagman,
                components: {
                    default: TicketCreateFlagmanView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: profilePaths.ProfileTicketAdministrator,
                name: ProfileRouteName.ProfileTicketAdministrator,
                components: {
                    default: TicketCreateAdministratorView,
                },
                meta: {
                    roles,
                },
            },
        ]
    }
]

export default routes
