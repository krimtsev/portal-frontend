import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    qualification: Qualification
    name: string
    phone: string
    experience: string
    statistics: string
    linkToWorks: string
}

export interface TicketSpecialist extends Ticket {
    attributes: TicketAttributes
}

export enum Qualification {
    BarberPlus = "BarberPlus",
    TobBarber = "TobBarber",
    TobBarberPlus = "TobBarberPlus",
    BrandBarber = "BrandBarber",
    BrandBarberPlus = "BrandBarberPlus",
    BrandBarberPro = "BrandBarberPro",
    Expert = "Expert",
}
