import type { Ticket } from "@v/profile/tickets/edit/definitions/ticket"
import { TicketState } from "@v/profile/tickets/edit/definitions/ticket"


export interface TicketStateData extends Ticket {
    state: TicketState
}
