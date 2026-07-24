export interface EventCalendarData {
    title:                string
    description:          string
    start_at:             string
    end_at:               string
    department_id:        number | null
    responsible_user_ids: number[]
}
