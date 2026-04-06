export interface PartnerOptionItem {
    id:   number,
    name: string
}

export interface PartnerOptionsResponse {
    list: PartnerOptionItem[]
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

export interface PartnersExportData {
    id:              number,
    organization:    string
    name:            string
    inn:             string
    ogrnip:          string
    contract_number: string
    address:         string
    disabled:        boolean
    start_at:        string
}
