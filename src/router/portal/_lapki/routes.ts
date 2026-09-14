import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/definitions/roles"

const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_lapki/home-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentCertificate,
        name:      PortalRouteName.DocumentCertificate,
        component: () => import("@v/portal/documents/_lapki/certificate/certificate-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.DocumentSubscription,
        name:      PortalRouteName.DocumentSubscription,
        component: () => import("@v/portal/documents/_lapki/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceSubscription,
        name:      PortalRouteName.ServiceSubscription,
        component: () => import("@v/portal/services/_lapki/subscription/subscription-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ServiceMissedCalls,
        name:      PortalRouteName.ServiceMissedCalls,
        component: () => import("@v/portal/services/_lapki/missed-calls/missed-calls-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactCentralOffice,
        name:      PortalRouteName.ContactCentralOffice,
        component: () => import("@v/portal/contacts/_lapki/central-office/central-office-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactPartners,
        name:      PortalRouteName.ContactPartners,
        component: () => import("@v/portal/contacts/_lapki/partners/partners-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.AdditionallyDiscount,
        name:      PortalRouteName.AdditionallyDiscount,
        component: () => import("@v/portal/additionally/_lapki/discounts/discounts-view.vue"),
        meta:      {
            roles,
        },
    },
]

export default routes
