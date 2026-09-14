import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export enum AdminQualification {
    Senior = "senior",
    Manager = "manager",
}

export interface TicketAttributes {
    qualification: AdminQualification
    name:          string
    phone:         string
    experience:    string
}

export interface TicketAdministrator extends Ticket {
    attributes: TicketAttributes
}

