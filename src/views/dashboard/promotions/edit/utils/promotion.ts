import type { PromotionFormData } from "@v/dashboard/promotions/edit/definitions/promotion"

export function toFormData(data: PromotionFormData): FormData {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("description", data.description ?? "")
    formData.append("disabled", data.disabled ? "1" : "0")

    if (data.expires_at != null) {
        formData.append("expires_at", data.expires_at)
    }

    if (data.image instanceof File) {
        formData.append("image", data.image)
    }

    if (data.remove_image) {
        formData.append("remove_image", "1")
    }

    return formData
}
