import { Roles } from "@/shared/roles/roles"

export interface UserData {
    name:       string
    login:      string
    password:   string
    role:       Roles
    email:      string
    notes:      string
    partner_id: number | null
    disabled:   boolean
    access:     UserAccess
}

interface UserPartner {
    id:   number
    name: string
}

interface UserAccess {
    location_map: boolean
}

export interface UserResponse {
    data: {
        name:     string
        login:    string
        role:     Roles
        email:    string | null
        partner:  UserPartner | null
        disabled: boolean
        notes:    string
        access:   UserAccess
    }
}
