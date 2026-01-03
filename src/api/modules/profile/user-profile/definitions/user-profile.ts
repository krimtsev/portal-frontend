import { Roles } from "@/shared/roles/roles"

export interface UserData {
    login: string
    name: string
    role: Roles
    email: string | null
    avatar: string | null
}

export interface PartnerData {
    name: string
    address: string
    inn: string
    ogrnip: string
    organization: string
    yclients_id: string
    mango_telnum: string
    contract_number: string
    email: string
}

export interface UserProfile {
    user: UserData
    partner: PartnerData
}
