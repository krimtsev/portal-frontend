import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    returnRate: string
    auditScore: string
    mastersCount: string
    openingDate: Date | null
    yandexMap: string
    twoGisMap: string
    cosmeticBrands: string
    missedReports: string
}

export interface TicketFlagman extends Ticket {
    attributes: TicketAttributes
}
