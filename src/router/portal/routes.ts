import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import PortalLayout from "@l/portal/PortalLayout.vue"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import CertificatesView from "@v/portal/certificates/certificates-view.vue"
import InstructionMangoRedirectView from "@v/portal/instructions/mango-redirect/mango-redirect-view.vue"
import InstructionYclientNotificationsView from "@v/portal/instructions/yclient-notifications/yclient-notifications-view.vue"
import ContactFranchiseeView from "@v/portal/contacts/franchisee/franchisee-view.vue"
import CloudView from "@v/portal/cloud/cloud-view.vue"


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
        ]
    }
]

export default routes
