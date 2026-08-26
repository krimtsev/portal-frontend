export interface PartnerMessageData {
    partner_ids: string[]
    message:     string
    file:        File | undefined
}

export interface PartnerMessageOption {
    id:   number
    name: string
}

export interface PartnerMessageOptionsResponse {
    list: PartnerMessageOption[]
}
