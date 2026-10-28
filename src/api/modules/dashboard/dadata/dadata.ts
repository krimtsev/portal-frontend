import { http } from "@/api"

export interface DadataBaseParams {
    query:  string
    count?: number
}

export interface BankData {}

export interface PartyData {
    name:    string
    inn:     string
    ogrn:    string
    okpo:    string
    address: string
    emails:  string
}

export async function suggestBank(params: DadataBaseParams) {
    return await http.get<{ data: BankData[] }>("dashboard/dadata/suggest/bank", { params })
}

export async function suggestParty(params: DadataBaseParams) {
    return await http.get<{ data: PartyData[] }>("dashboard/dadata/suggest/party", { params })
}

export async function findByIdParty(params: DadataBaseParams) {
    return await http.get<{ data: PartyData[] }>("dashboard/dadata/find-by-id/party", { params })
}
