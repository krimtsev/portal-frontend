export interface BankDetailPartner {
    id:   number
    name: string
}

export interface BankDetailListItem {
    id:                    number
    partner:               BankDetailPartner
    entrepreneur_name:     string
    inn:                   string
    checking_account:      string
    bank_name:             string
    bik:                   string
    correspondent_account: string
}
