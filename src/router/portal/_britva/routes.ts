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
import ServicePaidCO  from "@v/portal/_britva/services/paid-co/paid-co-view.vue"
import ServiceSubscription  from "@v/portal/_britva/services/subscription/subscription-view.vue"
import ServiceMissedCalls  from "@v/portal/_britva/services/missed-calls/missed-calls-view.vue"
import ServiceUserAnalytics from "@v/portal/_britva/services/user-analytics/user-analytics-view.vue"
import AdditionallyDiscounts from "@v/portal/_britva/additionally/discounts/discounts-view.vue"
import ContactCentralOffice from "@v/portal/_britva/contacts/central-office/central-office-view.vue"
import ContactPartners from "@v/portal/_britva/contacts/partners/partners-view.vue"


const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        redirect: {
            name: PortalRouteName.Home
        },
        meta: {
            title: "mc.partner.name"
        },
        children: [
            {
                path: portalPaths.Home,
                name: PortalRouteName.Home,
                components: {
                    default: HomeView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.DocumentSubscription,
                name: PortalRouteName.DocumentSubscription,
                components: {
                    default: SubscriptionView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.DocumentCertificate,
                name: PortalRouteName.DocumentCertificate,
                components: {
                    default: CertificateView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.DocumentFines,
                name: PortalRouteName.DocumentFines,
                components: {
                    default: FinesView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.DocumentFinesAudit,
                name: PortalRouteName.DocumentFinesAudit,
                components: {
                    default: FinesAuditView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.DocumentMangoAudit,
                name: PortalRouteName.DocumentMangoAudit,
                components: {
                    default: MangoAuditView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServicePaidCO,
                name: PortalRouteName.ServicePaidCO,
                components: {
                    default: ServicePaidCO,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceSubscription,
                name: PortalRouteName.ServiceSubscription,
                components: {
                    default: ServiceSubscription,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceMissedCalls,
                name: PortalRouteName.ServiceMissedCalls,
                components: {
                    default: ServiceMissedCalls,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceUserAnalytics,
                name: PortalRouteName.ServiceUserAnalytics,
                components: {
                    default: ServiceUserAnalytics,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.AdditionallyDiscount,
                name: PortalRouteName.AdditionallyDiscount,
                components: {
                    default: AdditionallyDiscounts,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ContactCentralOffice,
                name: PortalRouteName.ContactCentralOffice,
                components: {
                    default: ContactCentralOffice,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ContactPartners,
                name: PortalRouteName.ContactPartners,
                components: {
                    default: ContactPartners,
                },
                meta: {
                    roles,
                }
            },
        ]
    }
]

export default routes
