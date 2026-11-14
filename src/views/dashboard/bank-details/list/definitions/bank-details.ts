export interface BankDetailPartner {
    id:   number
    name: string
}

export interface BankDetailUser {
    id:   number
    name: string
}

export interface BankDetailListItem {
    id:                    number
    partner:               BankDetailPartner
    user:                  BankDetailUser
    entrepreneur_name:     string
    inn:                   string
    checking_account:      string
    bank_name:             string
    bik:                   string
    correspondent_account: string
}

export interface BankDetailExportRow {
    id:                    number
    bank_name:             string
    bik:                   string
    checking_account:      string
    correspondent_account: string
    entrepreneur_name:     string
    inn:                   string
    partner:               string
    user:                  string
    created_at:            string
    updated_at:            string
}

export interface BankDetailExportResponse {
    list: BankDetailExportRow[]
}
