import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import PortalLayout from "@l/portal/PortalLayout.vue"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import CertificatesView from "@v/portal/certificates/certificates-view.vue"
import InstructionMangoRedirect from "@v/portal/instructions/mango-redirect/mango-redirect-view.vue"
import InstructionYclientNotifications from "@v/portal/instructions/yclient-notifications/yclient-notifications-view.vue"
import ContactFranchisee from "@v/portal/contacts/franchisee/franchisee-view.vue"

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
                path: portalPaths.InstructionMangoRedirect,
                name: PortalRouteName.InstructionMangoRedirect,
                components: {
                    default: InstructionMangoRedirect,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.InstructionYclientNotifications,
                name: PortalRouteName.InstructionYclientNotifications,
                components: {
                    default: InstructionYclientNotifications,
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
                    default: ContactFranchisee,
                },
                meta: {
                    roles,
                }
            },
        ]
    }
]

export default routes
