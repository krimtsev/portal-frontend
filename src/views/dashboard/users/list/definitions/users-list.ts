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

export enum UsersStates {
    Active = 0,
    Disabled = 1
}
