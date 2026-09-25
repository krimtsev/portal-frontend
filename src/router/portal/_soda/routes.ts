import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/definitions/roles"

const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_soda/home-view.vue"),
        meta:      {
            roles,
        },
    },

    {
        path:      portalPaths.DocumentCertificate,
        name:      PortalRouteName.DocumentCertificate,
        component: () => import("@v/portal/documents/_soda/certificate/certificate-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentSubscription,
        name:      PortalRouteName.DocumentSubscription,
        component: () => import("@v/portal/documents/_soda/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentFines,
        name:      PortalRouteName.DocumentFines,
        component: () => import("@v/portal/documents/_soda/fines/fines-view.vue"),
        meta:      {
            roles,
        },
    },

    {
        path:      portalPaths.ServiceSubscription,
        name:      PortalRouteName.ServiceSubscription,
        component: () => import("@v/portal/services/_soda/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceMissedCalls,
        name:      PortalRouteName.ServiceMissedCalls,
        component: () => import("@v/portal/services/_soda/missed-calls/missed-calls-view.vue"),
        meta:      {
            roles,
        },
    },

    {
        path:      portalPaths.ContactCentralOffice,
        name:      PortalRouteName.ContactCentralOffice,
        component: () => import("@v/portal/contacts/_soda/central-office/central-office-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactPartners,
        name:      PortalRouteName.ContactPartners,
        component: () => import("@v/portal/contacts/_soda/partners/partners-view.vue"),
        meta:      {
            roles,
        },
    },

    {
        path:      portalPaths.AdditionallyDiscount,
        name:      PortalRouteName.AdditionallyDiscount,
        component: () => import("@v/portal/additionally/_soda/discounts/discounts-view.vue"),
        meta:      {
            roles,
        },
    },
]

export default routes
