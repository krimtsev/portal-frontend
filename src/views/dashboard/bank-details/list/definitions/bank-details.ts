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
    partner:               string
    user:                  string
    entrepreneur_name:     string
    inn:                   string
    checking_account:      string
    bank_name:             string
    bik:                   string
    correspondent_account: string
}

export interface BankDetailExportResponse {
    list: BankDetailExportRow[]
}
