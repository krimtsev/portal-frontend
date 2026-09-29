import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    name:        string
    phone:       string
    duration:    string
    statistics:  string
    linkToWorks: string
}

export interface TicketMakeup extends Ticket {
    attributes: TicketAttributes
}
