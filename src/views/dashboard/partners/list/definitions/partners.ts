export interface PartnerShortListItem {
    id:   number,
    name: string
}

export interface PartnerShortListResponse {
    list: PartnerShortListItem[]
}

export interface PartnerListItem {
    id:              number,
    name:            string,
    inn:             string,
    ogrnip:          string,
    organization:    string,
    yclients_id:     string,
    mango_telnum:    string,
    contract_number: string,
    start_at:        string,
    disabled:        boolean,
}
