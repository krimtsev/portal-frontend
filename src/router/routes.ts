import commonRoutes from "@r/common/routes"
import dashboardRoutes from "@r/dashboard/routes"
import britvaPortalRoutes from "@r/portal/_britva/routes"
import sodaPortalRoutes from "@r/portal/_soda/routes"
import env, { type Partner } from "~/env"

const partner = env.app.partner

const partnerRoutesMap: Record<Partner, typeof britvaPortalRoutes> = {
    britva: britvaPortalRoutes,
    soda: sodaPortalRoutes,
}
const portalRoutes = partnerRoutesMap[partner] || []

const routes = [
    ...commonRoutes,
    ...portalRoutes,
    ...dashboardRoutes,
]

export default routes
