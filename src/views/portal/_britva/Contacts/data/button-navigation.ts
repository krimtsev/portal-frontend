import { PortalRouteName } from "@r/portal/route-names"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

export const buttonNavigation: PortalRouteButton[] = [
    {
        label: "Центральный офис",
        route: PortalRouteName.ContactCentralOffice
    },
    {
        label: "Франчайзи",
        route: PortalRouteName.ContactFranchisee
    },
    {
        label: "Партнеры",
        route: PortalRouteName.ContactPartners
    }
]
