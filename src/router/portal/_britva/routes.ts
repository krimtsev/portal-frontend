import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import PortalLayout from "@l/portal/PortalLayout.vue"
import HomeView from "@v/portal/_britva/home/home-view.vue"
import SubscriptionView from "@v/portal/_britva/documents/subscription/subscription-view.vue"
import CertificateView from "@v/portal/_britva/documents/certificate/certificate-view.vue"
import FinesView from "@v/portal/_britva/documents/fines/fines-view.vue"
import FinesAuditView from "@v/portal/_britva/documents/fines-audit/fines-audit-view.vue"
import MangoAuditView from "@v/portal/_britva/documents/mango-audit/mango-audit-view.vue"


const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        redirect: {
            name: PortalRouteName.Home
        },
        children: [
            {
                path: portalPaths.Home,
                name: PortalRouteName.Home,
                components: {
                    default: HomeView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path: portalPaths.DocumentSubscription,
                name: PortalRouteName.DocumentSubscription,
                components: {
                    default: SubscriptionView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path: portalPaths.DocumentCertificate,
                name: PortalRouteName.DocumentCertificate,
                components: {
                    default: CertificateView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path: portalPaths.DocumentFines,
                name: PortalRouteName.DocumentFines,
                components: {
                    default: FinesView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path: portalPaths.DocumentFinesAudit,
                name: PortalRouteName.DocumentFinesAudit,
                components: {
                    default: FinesAuditView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            },
            {
                path: portalPaths.DocumentMangoAudit,
                name: PortalRouteName.DocumentMangoAudit,
                components: {
                    default: MangoAuditView,
                },
                meta: {
                    roles: [Roles.USER, Roles.ADMIN, Roles.SYSADMIN],
                }
            }
        ]
    }
]

export default routes
