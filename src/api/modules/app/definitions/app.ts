export interface PartnerFinance {
    [key: string]: {
        income_total: number
        percent:      number
    }
}

export interface MessageItem {
    id:          number
    title:       string
    description: string
}

export interface PortalHome {
    messages: MessageItem[]
    finances: PartnerFinance
}
