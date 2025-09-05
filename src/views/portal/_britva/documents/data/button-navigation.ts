import { PortalRouteName } from "@r/portal/route-names"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

export const buttonNavigation: PortalRouteButton[] = [
    {
        label: "Общие штрафы",
        route: PortalRouteName.DocumentFines
    },
    {
        label: "Штрафы по аудиту",
        route: PortalRouteName.DocumentFinesAudit
    },
    {
        label: "Манго-аудит",
        route: PortalRouteName.DocumentMangoAudit
    }
]
