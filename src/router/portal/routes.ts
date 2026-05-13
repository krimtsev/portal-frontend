import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import { Roles } from "@/definitions/roles.ts"
import { useAppStore } from "@s/app/app"


const roles = [Roles.USER, Roles.ADMIN, Roles.SYSADMIN]

const routes: RouteRecordRaw[] = [
    {
        path:      portalPaths.InstructionMangoRedirect,
        name:      PortalRouteName.InstructionMangoRedirect,
        component: () => import("@v/portal/instructions/mango-redirect/mango-redirect-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.InstructionYclientNotifications,
        name:      PortalRouteName.InstructionYclientNotifications,
        component: () => import("@v/portal/instructions/yclient-notifications/yclient-notifications-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.IpTelephonyTroubleshooting,
        name:      PortalRouteName.IpTelephonyTroubleshooting,
        component: () => import("@v/portal/instructions/ip-telephony-troubleshooting/ip-telephony-troubleshooting-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.Certificates,
        name:      PortalRouteName.Certificates,
        component: () => import("@v/portal/certificates/certificates-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.ContactFranchisee,
        name:      PortalRouteName.ContactFranchisee,
        component: () => import("@v/portal/contacts/franchisee/franchisee-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.Cloud,
        name:      PortalRouteName.Cloud,
        component: () => import("@v/portal/cloud/cloud-view.vue"),
        meta:      {
            roles,
        },
    },
    {
        path:      portalPaths.LocationMap,
        name:      PortalRouteName.LocationMap,
        component: () => import("@v/portal/additionally/location-map/location-map-view.vue"),
        meta:      {
            roles,
        },
        beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next) => {
            const appStore = useAppStore()
            if (!appStore.showLocationMap) {
                return next({ name: PortalRouteName.Home })
            }
            next()
        },
    },
]

export default routes
