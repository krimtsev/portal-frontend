import type {
    PartnerMessageData,
} from "@v/dashboard/partners/notifications/message/definitions/partner-notification-message"

export function createMessageFormData(data: PartnerMessageData): FormData {
    const formData = new FormData()

    data.partner_ids.forEach((id) => {
        formData.append("partner_ids[]", String(id))
    })

    formData.append("message", data.message)

    if (data.file) {
        const rawFile = Array.isArray(data.file) ? data.file[0] : data.file

        if (rawFile instanceof File) {
            formData.append("file", rawFile)
        }
    }

    return formData
}
