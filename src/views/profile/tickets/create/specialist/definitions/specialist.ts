import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"
import type { BarberQualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"

export enum DefaultQualification {
    Master = "Master",
    TopMaster = "TopMaster",
    BrandMaster = "BrandMaster",
}

export type SpecialistQualification = DefaultQualification | BarberQualification

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

