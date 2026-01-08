import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"

interface TicketCategory {
    id: number
    title: string
}

interface TicketPartner {
    id: number
    name: string
}

interface TicketUser {
    login: string
    name: string
}

export interface TicketListItem {
    id: string
    title: string
    type: TicketType
    category: TicketCategory | null
    partner: TicketPartner | null
    user: TicketUser | null
    state: {
        key: string
        value: string
    }
    last_message_at: string
}
