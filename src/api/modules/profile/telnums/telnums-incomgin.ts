import { http } from "@/api"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel"

export async function partnerDay(partnerId: number, params: { date: string }) {
    return await http.get<{ data: MangoCallsData[] }>(`profile/telnums/incoming/${partnerId}/hourly`, { params })
}
