import type {
    PromoDialogFormData,
} from "@v/dashboard/promo-dialogs/edit/definitions/promo-dialog"

export function toFormData(data: PromoDialogFormData): FormData {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("description", data.description ?? "")
    formData.append("disabled", data.disabled ? "1" : "0")

    if (data.template != null) {
        formData.append("template", data.template)
    }

    if (data.image instanceof File) {
        formData.append("image", data.image)
    }

    if (data.remove_image) {
        formData.append("remove_image", "1")
    }

    return formData
}
