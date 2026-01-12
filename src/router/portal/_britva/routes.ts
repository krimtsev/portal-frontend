import type { RouteRecordRaw } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/shared/roles/roles"
import { portalPaths } from "@r/portal/path"
import PortalLayout from "@l/portal/PortalLayout.vue"
import HomeView from "@v/portal/home/_britva/home-view.vue"
import SubscriptionView from "@v/portal/documents/_britva/subscription/subscription-view.vue"
import CertificateView from "@v/portal/documents/_britva/certificate/certificate-view.vue"
import FinesView from "@v/portal/documents/_britva/fines/fines-view.vue"
import FinesAuditView from "@v/portal/documents/_britva/fines-audit/fines-audit-view.vue"
import MangoAuditView from "@v/portal/documents/_britva/mango-audit/mango-audit-view.vue"
import ServicePaidCOView  from "@v/portal/services/_britva/paid-co/paid-co-view.vue"
import ServiceSubscriptionView  from "@v/portal/services/_britva/subscription/subscription-view.vue"
import ServiceMissedCallsView  from "@v/portal/services/_britva/missed-calls/missed-calls-view.vue"
import ServiceUserAnalyticsView from "@v/portal/services/_britva/user-analytics/user-analytics-view.vue"
import ServiceBranchReviewView from "@v/portal/services/_britva/branch-review/branch-review-view.vue"
import ServiceSearchStaffView from "@v/portal/services/_britva/search-staff/search-staff-view.vue"


import AdditionallyDiscounts from "@v/portal/additionally/_britva/discounts/discounts-view.vue"
import ContactCentralOffice from "@v/portal/contacts/_britva/central-office/central-office-view.vue"
import ContactPartners from "@v/portal/contacts/_britva/partners/partners-view.vue"


const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: PortalLayout,
        redirect: {
            name: PortalRouteName.Home
        },
        meta: {
            title: "mc.partner.title"
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
                    default: ServicePaidCOView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceSubscription,
                name: PortalRouteName.ServiceSubscription,
                components: {
                    default: ServiceSubscriptionView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceMissedCalls,
                name: PortalRouteName.ServiceMissedCalls,
                components: {
                    default: ServiceMissedCallsView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceUserAnalytics,
                name: PortalRouteName.ServiceUserAnalytics,
                components: {
                    default: ServiceUserAnalyticsView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceBranchReview,
                name: PortalRouteName.ServiceBranchReview,
                components: {
                    default: ServiceBranchReviewView,
                },
                meta: {
                    roles,
                }
            },
            {
                path: portalPaths.ServiceSearchStaff,
                name: PortalRouteName.ServiceSearchStaff,
                components: {
                    default: ServiceSearchStaffView,
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
