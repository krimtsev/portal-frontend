import type { RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.Home,
        name:      PortalRouteName.Home,
        component: () => import("@v/portal/home/_soda/home-view.vue"),
    },

    {
        path:      portalPaths.DocumentCertificate,
        name:      PortalRouteName.DocumentCertificate,
        component: () => import("@v/portal/documents/_soda/certificate/certificate-view.vue"),
    },
    {
        path:      portalPaths.DocumentSubscription,
        name:      PortalRouteName.DocumentSubscription,
        component: () => import("@v/portal/documents/_soda/subscription/subscription-view.vue"),
    },
    {
        path:      portalPaths.DocumentFines,
        name:      PortalRouteName.DocumentFines,
        component: () => import("@v/portal/documents/_soda/fines/fines-view.vue"),
    },
    {
        path:      portalPaths.DocumentFinesAudit,
        name:      PortalRouteName.DocumentFinesAudit,
        component: () => import("@v/portal/documents/_soda/fines-audit/fines-audit-view.vue"),
    },
    {
        path:      portalPaths.DocumentMangoAudit,
        name:      PortalRouteName.DocumentMangoAudit,
        component: () => import("@v/portal/documents/_soda/mango-audit/mango-audit-view.vue"),
    },

    {
        path:      portalPaths.ServiceSubscription,
        name:      PortalRouteName.ServiceSubscription,
        component: () => import("@v/portal/services/_soda/subscription/subscription-view.vue"),
    },
    {
        path:      portalPaths.ServiceMissedCalls,
        name:      PortalRouteName.ServiceMissedCalls,
        component: () => import("@v/portal/services/_soda/missed-calls/missed-calls-view.vue"),
    },

    {
        path:      portalPaths.ContactCentralOffice,
        name:      PortalRouteName.ContactCentralOffice,
        component: () => import("@v/portal/contacts/_soda/central-office/central-office-view.vue"),
    },
    {
        path:      portalPaths.ContactPartners,
        name:      PortalRouteName.ContactPartners,
        component: () => import("@v/portal/contacts/_soda/partners/partners-view.vue"),
    },

    {
        path:      portalPaths.AdditionallyDiscount,
        name:      PortalRouteName.AdditionallyDiscount,
        component: () => import("@v/portal/additionally/_soda/discounts/discounts-view.vue"),
    },

    {
        path:      portalPaths.TrademarksNailService,
        name:      PortalRouteName.TrademarksNailService,
        component: () => import("@v/portal/trademarks/_soda/nail-service/nail-service-view.vue"),
    },
    {
        path:      portalPaths.TrademarksStylists,
        name:      PortalRouteName.TrademarksStylists,
        component: () => import("@v/portal/trademarks/_soda/stylists/stylists-view.vue"),
    },
    {
        path:      portalPaths.TrademarksEyebrowArtists,
        name:      PortalRouteName.TrademarksEyebrowArtists,
        component: () => import("@v/portal/trademarks/_soda/eyebrow-artists/eyebrow-artists-view.vue"),
    },
]

export default routes
