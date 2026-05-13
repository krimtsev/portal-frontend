import { Roles } from "@/definitions/roles"

export interface UserData {
    name:        string
    login:       string
    password:    string
    role:        Roles
    email:       string
    notes:       string
    partner_id:  number | null
    departments: string[]
    disabled:    boolean
    access:      UserAccess
}

interface UserPartner {
    id:   number
    name: string
}

export enum UserAccessType {
    LocationMap = "location_map",
}

export interface UserAccess {
    [UserAccessType.LocationMap]: boolean
}

export interface UserResponse {
    data: {
        name:        string
        login:       string
        role:        Roles
        email:       string | null
        partner:     UserPartner | null
        departments: number[]
        disabled:    boolean
        notes:       string
        access:      UserAccess
    }
}
