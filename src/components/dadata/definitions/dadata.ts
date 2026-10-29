export interface DaDataBaseParams {
    query:  string
    count?: number
}

export interface BankData {
    name:                  string
    bic:                   string
    inn:                   string
    kpp:                   string
    okpo:                  string
    correspondent_account: string
}

export interface PartyData {
    name:    string
    inn:     string
    ogrn:    string
    okpo:    string
    address: string
    emails:  string
}
