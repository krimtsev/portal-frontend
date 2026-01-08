import { PortalRouteName } from "@r/portal/route-names"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

export const buttonNavigation: PortalRouteButton[] = [
    {
        label: "Сотрудников центрального офиса",
        route: PortalRouteName.ContactCentralOffice
    },
    {
        label: "Владельцев франшиз",
        route: PortalRouteName.ContactFranchisee
    },
    {
        label: "Партнеры",
        route: PortalRouteName.ContactPartners
    }
]
