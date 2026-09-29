import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    name:         string
    phone:        string
    duration:     string
    certificates: string
    practice:     string
    blanc:        string
    armchairs:    string
}

export interface TicketPodiatrist extends Ticket {
    attributes: TicketAttributes
}
