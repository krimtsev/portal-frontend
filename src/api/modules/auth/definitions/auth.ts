import { Roles } from "@/definitions/roles.ts"

export interface LoginCredentials {
    login:    string
    password: string
    remember: boolean
}

export interface UserData {
    login:   string
    role:    Roles
    name:    string
    avatar:  string
    email:   string
    partner:    {
        id:       number
        name:     string
        disabled: boolean
    } | null
}

export interface UserAccessData {
    location_map: boolean
}

export interface AuthData {
    user:   UserData
    access: UserAccessData
}
