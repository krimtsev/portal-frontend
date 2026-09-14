import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"
import type { BarberQualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import type { LapkiQualification } from "@v/profile/tickets/create/specialist/_lapki/definitions/specialist"

export type SpecialistQualification = BarberQualification | LapkiQualification

export interface TicketAttributes {
    qualification: SpecialistQualification
    name:          string
    phone:         string
    experience:    string
    statistics:    string
    linkToWorks:   string
}

export interface TicketSpecialist extends Ticket {
    attributes: TicketAttributes
}

