import { Roles } from "@/shared/roles/roles"
export interface LoginCredentials {
    login: string
    password: string
    remember: boolean
}

export interface UserData {
    login:      string
    role:       Roles
    name:       string
    avatar:     string
    email:      string
    partner:    {
        id:       number
        name:     string
        disabled: boolean
    } | null
}

export interface AuthData {
    user:   UserData
}
