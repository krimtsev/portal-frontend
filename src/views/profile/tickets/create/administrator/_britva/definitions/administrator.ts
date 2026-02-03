import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    qualification: Qualification
    name: string
    phone: string
    experience: string
}

export interface TicketAdministrator extends Ticket {
    attributes: TicketAttributes
}

export enum Qualification {
    Senior = "senior",
    Manager = "manager",
}
