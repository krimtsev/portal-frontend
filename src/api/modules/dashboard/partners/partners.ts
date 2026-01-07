import { http } from "@/api"
import type { PartnerShortListResponse } from "@v/dashboard/partners/definitions/partners"

export async function shortList() {
    return await http.get<PartnerShortListResponse>("dashboard/partners/short-list")
}
