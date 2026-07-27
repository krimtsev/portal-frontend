export interface EventCalendarUser {
    id:   number
    name: string
}

export interface EventCalendarDepartment {
    id:   number
    name: string
}

export interface EventCalendarListItem {
    id:         number
    title:      string
    start_at:   string
    end_at:     string
    user:       EventCalendarUser | null
    department: EventCalendarDepartment | null
    created_at: string
}
