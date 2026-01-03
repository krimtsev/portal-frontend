import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    name: string
    phone: string
    website: string
    registration: string
    yandexMap: string
    twoGisMap: string
    instagram: string
    format: string
    promotion: string
}

export interface TicketDesign extends Ticket {
    attributes: TicketAttributes
}
