import { PortalRouteName } from "@r/portal/route-names"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

export const buttonNavigation: PortalRouteButton[] = [
    {
        label: "Ногтевой сервис",
        route: PortalRouteName.TrademarksNailService,
    },
    {
        label: "Стилисты",
        route: PortalRouteName.TrademarksStylists,
    },
    {
        label: "Бровисты",
        route: PortalRouteName.TrademarksEyebrowArtists,
    },
]
