import { Roles } from "@/shared/roles/roles"

export interface UserData {
    name:       string
    login:      string
    password:   string
    role:       Roles
    email:      string
    partner_id: number | null
    disabled:   boolean
}

interface UserPartner {
    id:   number
    name: string
}

export interface UserResponse {
    data: {
        name:     string
        login:    string
        role:     Roles
        email:    string | null
        partner:  UserPartner | null
        disabled: boolean
    }
}
