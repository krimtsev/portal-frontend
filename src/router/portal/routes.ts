import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import { useAppStore } from "@s/app/app"

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.InstructionMangoRedirect,
        name:      PortalRouteName.InstructionMangoRedirect,
        component: () => import("@v/portal/instructions/mango-redirect/mango-redirect-view.vue"),
    },
    {
        path:      portalPaths.InstructionYclientNotifications,
        name:      PortalRouteName.InstructionYclientNotifications,
        component: () => import("@v/portal/instructions/yclient-notifications/yclient-notifications-view.vue"),
    },
    {
        path:      portalPaths.IpTelephonyTroubleshooting,
        name:      PortalRouteName.IpTelephonyTroubleshooting,
        component: () => import("@v/portal/instructions/ip-telephony-troubleshooting/ip-telephony-troubleshooting-view.vue"),
    },
    {
        path:      portalPaths.Certificates,
        name:      PortalRouteName.Certificates,
        component: () => import("@v/portal/certificates/certificates-view.vue"),
    },
    {
        path:      portalPaths.ContactFranchisee,
        name:      PortalRouteName.ContactFranchisee,
        component: () => import("@v/portal/contacts/franchisee/franchisee-view.vue"),
    },
    {
        path:      portalPaths.Cloud,
        name:      PortalRouteName.Cloud,
        component: () => import("@v/portal/cloud/cloud-view.vue"),
    },
    {
        path:        portalPaths.LocationMap,
        name:        PortalRouteName.LocationMap,
        component:   () => import("@v/portal/additionally/location-map/location-map-view.vue"),
        beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next) => {
            const appStore = useAppStore()
            if (!appStore.showLocationMap) {
                return next({ name: PortalRouteName.Home })
            }
            next()
        },
    },
    {
        path:      portalPaths.IntegrationTelephonyQuality,
        name:      PortalRouteName.IntegrationTelephonyQuality,
        component: () => import("@v/portal/integration/telephony-quality/telephony-quality-view.vue"),
    },
    {
        path:      portalPaths.IntegrationVideoAnalytics,
        name:      PortalRouteName.IntegrationVideoAnalytics,
        component: () => import("@v/portal/integration/video-analytics/video-analytics-view.vue"),
    },
]

export default routes
