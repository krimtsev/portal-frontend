import type { Roles } from "@/shared/roles/roles"

interface UserPartner {
    id:   number
    name: string
}

export interface UsersListItem {
    id:            number
    login:         string
    partner:       UserPartner
    role:          string
    disabled:      boolean
    last_activity: string
}

export interface UsersExportData {
    id:            number
    name:          string
    login:         string
    role:          Roles
    partner:       string
    disabled:      boolean
    last_activity: string
}
