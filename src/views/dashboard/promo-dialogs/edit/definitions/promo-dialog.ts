export interface PromoDialogData {
    title:       string
    description: string
    template:    string | null
    disabled:    boolean
}

export interface PromoDialogResponse {
    data: PromoDialogData
}
