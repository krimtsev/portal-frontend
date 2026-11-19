export interface PromoDialogData {
    title:       string
    description: string
    template:    string | null
    disabled:    boolean
    image:       string | null
}

export interface PromoDialogFormData {
    title:        string
    description:  string
    template:     string | null
    disabled:     boolean
    image:        File | null
    remove_image: boolean
}

export interface PromoDialogResponse {
    data: PromoDialogData
}
