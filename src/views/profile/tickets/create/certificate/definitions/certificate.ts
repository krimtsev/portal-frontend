import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    code: string,
    sum: number | null,
    paymentDate: Date | null,
    name: string,
}

export interface TicketCertificate extends Ticket {
    attributes: TicketAttributes
}
