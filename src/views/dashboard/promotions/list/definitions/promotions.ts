interface PromotionUser {
    id:   number
    name: string
}

export interface PromotionListItem {
    id:         number
    title:      string
    disabled:   boolean
    expires_at: string
    is_expired: boolean
    user:       PromotionUser
    created_at: string
}

export interface PromotionExportItem{
    id:          number
    title:       string
    description: string
    disabled:    boolean
    expires_at:  string
    created_at:  string
    user:        string
}
