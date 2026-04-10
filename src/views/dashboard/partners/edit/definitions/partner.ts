export interface PartnerData {
    group_id:        number | null
    organization:    string
    inn:             string
    ogrnip:          string
    name:            string
    contract_number: string
    email:           string
    yclients_id:     string
    mango_telnum:    string
    address:         string
    start_at:        Date | null
    disabled:        boolean
    telnums:         PartnerTelnumItem[]
}

export interface PartnerResponse {
    data: PartnerData
}

export interface PartnerTelnumItem {
    id?:    number
    name:   string
    number: string
}
