import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"

import { Roles } from "@/shared/roles/roles"

const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_britva/home-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentSubscription,
        name:      PortalRouteName.DocumentSubscription,
        component: () => import("@v/portal/documents/_britva/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentCertificate,
        name:      PortalRouteName.DocumentCertificate,
        component: () => import("@v/portal/documents/_britva/certificate/certificate-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentFines,
        name:      PortalRouteName.DocumentFines,
        component: () => import("@v/portal/documents/_britva/fines/fines-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentFinesAudit,
        name:      PortalRouteName.DocumentFinesAudit,
        component: () => import("@v/portal/documents/_britva/fines-audit/fines-audit-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentMangoAudit,
        name:      PortalRouteName.DocumentMangoAudit,
        component: () => import("@v/portal/documents/_britva/mango-audit/mango-audit-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServicePaidCO,
        name:      PortalRouteName.ServicePaidCO,
        component: () => import("@v/portal/services/_britva/paid-co/paid-co-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceSubscription,
        name:      PortalRouteName.ServiceSubscription,
        component: () => import("@v/portal/services/_britva/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceMissedCalls,
        name:      PortalRouteName.ServiceMissedCalls,
        component: () => import("@v/portal/services/_britva/missed-calls/missed-calls-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceUserAnalytics,
        name:      PortalRouteName.ServiceUserAnalytics,
        component: () => import("@v/portal/services/_britva/user-analytics/user-analytics-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceBranchReview,
        name:      PortalRouteName.ServiceBranchReview,
        component: () => import("@v/portal/services/_britva/branch-review/branch-review-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceSearchStaff,
        name:      PortalRouteName.ServiceSearchStaff,
        component: () => import("@v/portal/services/_britva/search-staff/search-staff-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.AdditionallyDiscount,
        name:      PortalRouteName.AdditionallyDiscount,
        component: () => import("@v/portal/additionally/_britva/discounts/discounts-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactCentralOffice,
        name:      PortalRouteName.ContactCentralOffice,
        component: () => import("@v/portal/contacts/_britva/central-office/central-office-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactPartners,
        name:      PortalRouteName.ContactPartners,
        component: () => import("@v/portal/contacts/_britva/partners/partners-view.vue"),
        meta:      {
            roles,
        },
    },
]

export default routes
