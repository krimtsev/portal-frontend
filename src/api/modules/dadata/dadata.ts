import { http } from "@/api"
import type {
    DadataBaseParams,
    BankData,
    PartyData,
} from "@c/dadata/definitions/dadata.ts"

// Банки
export async function suggestBank(params: DadataBaseParams) {
    return await http.get<{ data: BankData[] }>("dadata/suggest/bank", { params })
}

export async function findByIdBank(params: DadataBaseParams) {
    return await http.get<{ data: BankData[] }>("dadata/find-by-id/bank", { params })
}

// Компании
export async function suggestParty(params: DadataBaseParams) {
    return await http.get<{ data: PartyData[] }>("dadata/suggest/party", { params })
}

export async function findByIdParty(params: DadataBaseParams) {
    return await http.get<{ data: PartyData[] }>("dadata/find-by-id/party", { params })
}
