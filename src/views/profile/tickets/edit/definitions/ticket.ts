// Базовый интерфейс, наследуется экземплярами заявлений
export interface Ticket {
    title:       string
    type:        TicketType
    partner_id:  number | null
    category_id: number | null
    message:     string
    files:       File[]
}

export enum TicketType {
    General     = "general",
    Blacklist   = "blacklist",
    Certificate = "certificate",
    Design      = "design",
    Specialist  = "specialist",
}

export enum TicketState {
    New        = "new",
    InProgress = "in_progress",
    Waiting    = "waiting",
    Success    = "success",
    Closed     = "closed",
    Cancel     = "cancel",
}


export enum TicketMessageType {
    Message = "message",
    Event   = "event",
}

interface TicketCategory {
    id:    number
    title: string
}

interface TicketPartner {
    id:   number
    name: string
}

interface TicketUser {
    login: string
    name:  string
}

export interface TicketFile {
    id:    number
    title: string
    name:  string
    ext:   string
    path:  string
}

export interface TicketMessage {
    id:         number
    type:       TicketMessageType.Message
    text:       string
    created_at: string
    user:       TicketUser
    files:      TicketFile[]
}

export interface TicketChangeField {
    old: string | number
    new: string | number
}

export interface TicketEvent {
    id:         number
    type:       TicketMessageType.Event
    changes:    Record<string, TicketChangeField>
    created_at: string
    user:       TicketUser
}

export interface TicketDetails {
    id:       number
    title:    string
    type:     TicketType
    category: TicketCategory | null
    partner:  TicketPartner | null
    user:     TicketUser | null
    state:    TicketState
    attributes?: Record<string, string>
    timeline:    TicketMessage[] | TicketEvent[]
}

export interface TicketResponse {
    data: TicketDetails
}

