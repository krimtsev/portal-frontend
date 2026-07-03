import type { MonthsBarChartData } from "@c/charts/definitions/charts"


export interface MessageItem {
    id:          number
    title:       string
    description: string
}

export interface PortalHome {
    messages: MessageItem[]
    finances: MonthsBarChartData
}
