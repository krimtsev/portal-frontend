import { Roles } from "@/definitions/roles"

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
    user:         UserData
    access:       UserAccessData
    partner:      PartnerData | null
    timeZoneName: string
}
