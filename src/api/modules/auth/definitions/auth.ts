import { Roles } from "@/definitions/roles"
import type { PromoDialog } from "@/api/modules/promo-dialog/definitions/promo-dialog"

export interface LoginCredentials {
    login:    string
    password: string
    remember: boolean
}

export interface AuthData {
    user:         UserData
    partner:      PartnerData | null
    timeZoneName: string
}

export interface PartnerData {
    id:       number
    name:     string
    disabled: boolean
}


export interface UserData {
    login:  string
    role:   Roles
    name:   string
    avatar: string
    email:  string
}

export interface UserAccessData {
    location_map: boolean
}

export interface AuthResponse {
    user:           UserData
    access:         UserAccessData
    partner:        PartnerData | null
    time_zone_name: string | null
    promoDialogs:   PromoDialog[]
}
