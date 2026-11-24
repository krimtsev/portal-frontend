import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"


const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_lapki/home-view.vue"),
    },

    {
        path:      portalPaths.DocumentCertificate,
        name:      PortalRouteName.DocumentCertificate,
        component: () => import("@v/portal/documents/_lapki/certificate/certificate-view.vue"),
    },
    {
        path:      portalPaths.DocumentSubscription,
        name:      PortalRouteName.DocumentSubscription,
        component: () => import("@v/portal/documents/_lapki/subscription/subscription-view.vue"),
    },
    {
        path:      portalPaths.DocumentFines,
        name:      PortalRouteName.DocumentFines,
        component: () => import("@v/portal/documents/_lapki/fines/fines-view.vue"),
    },

    {
        path:      portalPaths.ServiceSubscription,
        name:      PortalRouteName.ServiceSubscription,
        component: () => import("@v/portal/services/_lapki/subscription/subscription-view.vue"),
    },
    {
        path:      portalPaths.ServiceMissedCalls,
        name:      PortalRouteName.ServiceMissedCalls,
        component: () => import("@v/portal/services/_lapki/missed-calls/missed-calls-view.vue"),
    },

    {
        path:      portalPaths.ContactCentralOffice,
        name:      PortalRouteName.ContactCentralOffice,
        component: () => import("@v/portal/contacts/_lapki/central-office/central-office-view.vue"),
    },
    {
        path:      portalPaths.ContactPartners,
        name:      PortalRouteName.ContactPartners,
        component: () => import("@v/portal/contacts/_lapki/partners/partners-view.vue"),
    },

    {
        path:      portalPaths.AdditionallyDiscount,
        name:      PortalRouteName.AdditionallyDiscount,
        component: () => import("@v/portal/additionally/_lapki/discounts/discounts-view.vue"),
    },
]

export default routes
