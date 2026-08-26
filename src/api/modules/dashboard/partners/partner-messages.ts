import { http } from "@/api"
import type {
    PartnerMessageOptionsResponse,
} from "@v/dashboard/partners/notifications/message/definitions/partner-notification-message"


export async function options() {
    return await http.get<PartnerMessageOptionsResponse>("dashboard/partner-messages/options")
}

export async function send(formData: FormData) {
    return await http.post<null>("dashboard/partner-messages/send", formData)
}
