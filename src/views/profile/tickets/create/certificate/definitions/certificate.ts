import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"

export interface TicketAttributes {
    code:        string
    sum:         number | null
    paymentDate: Date | null
    name:        string

    // Банковские реквизиты
    entrepreneurName:     string
    inn:                  string
    checkingAccount:      string
    bankName:             string
    bik:                  string
    correspondentAccount: string
}

export interface TicketCertificate extends Ticket {
    attributes: TicketAttributes
}
