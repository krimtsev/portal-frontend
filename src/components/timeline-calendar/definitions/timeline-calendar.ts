export interface TimelineEvent {
    id:                number
    title:             string
    description?:      string
    start_at:          string
    end_at:            string
    department_id:     number
    user:              string
    responsible_users: string[] | null
}

export interface ProcessedTimelineEvent extends TimelineEvent {
    startCol:      number
    endCol:        number
    durationDays:  number
    gridRow:       number
    colorVariant?: string
}
