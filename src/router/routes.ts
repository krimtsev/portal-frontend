import commonRoutes from "@r/common/routes"
import portalRoutes from "@r/portal/routes"
import dashboardRoutes from "@r/dashboard/routes"

const routes = [
    ...commonRoutes,
    ...portalRoutes,
    ...dashboardRoutes,
]

export default routes
