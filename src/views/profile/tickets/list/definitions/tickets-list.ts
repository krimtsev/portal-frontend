import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import type { DepartmentType } from "@/shared/department/department"

interface TicketPartner {
    id:   number
    name: string
}

interface TicketUser {
    login: string
    name:  string
}

export const maxTitleLength = 125
export const maxMessageLength = 2000
export const maxMessageLengthShort = 500

export interface TicketListItem {
    id:         string
    title:      string
    type:       TicketType
    department: DepartmentType | null
    partner:    TicketPartner | null
    user:       TicketUser | null
    state: {
        key:   string
        value: string
    }
    last_message_at: string
}
