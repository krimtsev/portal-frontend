export interface BankDetailData {
    entrepreneur_name:     string
    inn:                   string
    checking_account:      string
    bank_name:             string
    bik:                   string
    correspondent_account: string
    user_id:               number | null
    partner_id:            number | null
}

export interface BankDetailResponse {
    data: BankDetailData
}
