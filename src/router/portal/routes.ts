import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import PortalLayout from "@l/portal/PortalLayout.vue"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import ProfileView from "@v/profile/profile-view.vue"
import CertificatesView from "@v/portal/certificates/certificates-view.vue"
import InstructionMangoRedirectView from "@v/portal/instructions/mango-redirect/mango-redirect-view.vue"
import InstructionYclientNotificationsView from "@v/portal/instructions/yclient-notifications/yclient-notifications-view.vue"
import ContactFranchiseeView from "@v/portal/contacts/franchisee/franchisee-view.vue"
import CloudView from "@v/portal/cloud/cloud-view.vue"
import TicketDesign from "@v/portal/_britva/tickets/design/design-view.vue"
import TicketCertificate from "@v/portal/_britva/tickets/certificate/certificate-view.vue"
import TicketSpecialist from "@v/portal/_britva/tickets/specialist/specialist-view.vue"
import TicketBlacklist from "@v/portal/_britva/tickets/blacklist/blacklist-view.vue"

const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        meta: {
            title: "mc.partner.name"
        },
        children: [
            {
                path: portalPaths.Profile,
                name: PortalRouteName.Profile,
                components: {
                    default: ProfileView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.InstructionMangoRedirect,
                name: PortalRouteName.InstructionMangoRedirect,
                components: {
                    default: InstructionMangoRedirectView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.InstructionYclientNotifications,
                name: PortalRouteName.InstructionYclientNotifications,
                components: {
                    default: InstructionYclientNotificationsView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.Certificates,
                name: PortalRouteName.Certificates,
                components: {
                    default: CertificatesView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ContactFranchisee,
                name: PortalRouteName.ContactFranchisee,
                components: {
                    default: ContactFranchiseeView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.Cloud,
                name: PortalRouteName.Cloud,
                components: {
                    default: CloudView,
                },
                meta: {
                    roles,
                },
            },
            {
                path: portalPaths.TicketDesign,
                name: PortalRouteName.TicketDesign,
                components: {
                    default: TicketDesign,
                },
                meta: {
                    roles,
                },
            },
            {
                path: portalPaths.TicketCertificate,
                name: PortalRouteName.TicketCertificate,
                components: {
                    default: TicketCertificate,
                },
                meta: {
                    roles,
                },
            },
            {
                path: portalPaths.TicketSpecialist,
                name: PortalRouteName.TicketSpecialist,
                components: {
                    default: TicketSpecialist,
                },
                meta: {
                    roles,
                },
            },
            {
                path: portalPaths.TicketBlacklist,
                name: PortalRouteName.TicketBlacklist,
                components: {
                    default: TicketBlacklist,
                },
                meta: {
                    roles,
                },
            },
        ]
    }
]

export default routes
