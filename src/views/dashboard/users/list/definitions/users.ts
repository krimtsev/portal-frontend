import type { Roles } from "@/definitions/roles"
import type { UserAccess } from "@v/dashboard/users/edit/definitions/user"

interface UserPartner {
    id:   number
    name: string
}

export interface UsersListItem {
    id:            number
    login:         string
    name:          string
    partner:       UserPartner
    role:          string
    disabled:      boolean
    last_activity: string
    access:        UserAccess
    departments:   number[]
}

export interface UsersExportData {
    id:            number
    name:          string
    login:         string
    role:          Roles
    partner:       string
    email:         string
    disabled:      boolean
    last_activity: string
    departments:   number[]
}
