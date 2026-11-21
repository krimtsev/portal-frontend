export interface PromotionData {
    title:       string
    description: string
    image:       string | null
    disabled:    boolean
    expires_at:  string | null
}

export interface PromotionFormData {
    title:        string
    description:  string
    image:        File | null
    remove_image: boolean
    disabled:     boolean
    expires_at:   string | null
}

export interface PromotionResponse {
    data: PromotionData
}
