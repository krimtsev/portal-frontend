import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    name: string,
    phone: string,
    duration: string,
}

export interface TicketBlacklist extends Ticket {
    attributes: TicketAttributes
}
