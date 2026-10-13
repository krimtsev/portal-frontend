import { http } from "@/api"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel"

export async function partnerPeriod(partnerId: number, params: { date_from: string, date_to: string }) {
    return await http.get<{ data: MangoCallsData[] }>(`profile/telnums/incoming/${partnerId}/hourly`, { params })
}
