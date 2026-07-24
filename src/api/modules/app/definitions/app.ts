import type { MonthsBarChartData } from "@c/charts/definitions/charts"
import type { TimelineEvent } from "@c/timeline-calendar/definitions/timeline-calendar"

export interface MessageItem {
    id:          number
    title:       string
    description: string
}

export interface PortalHome {
    messages: MessageItem[]
    finances: MonthsBarChartData
    events:   TimelineEvent[]
}
