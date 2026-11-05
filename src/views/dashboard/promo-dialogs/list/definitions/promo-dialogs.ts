export interface PromoDialogListItem {
    id:         number
    title:      string
    template:   string | null
    disabled:   boolean
    created_at: string
}

export interface PromoDialogExportRow {
    login:        string
    name:         string | null
    disabled:     boolean
    partner_name: string | null
    is_read:      boolean
    read_at:      string | null
}

export interface PromoDialogExportResponse {
    dialog: {
        id:    number
        title: string
    }
    list: PromoDialogExportRow[]
}
