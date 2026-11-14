import { http } from "@/api"

export interface UserPartnerItem {
    id:   number
    name: string
}

export interface UserPartners {
    partner_id: number | null
    partners:   UserPartnerItem[]
}

export async function userPartners() {
    return await http.get<UserPartners>("user-partners")
}
