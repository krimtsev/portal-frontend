import { http } from "@/api"
import type { AnalyticsData } from "@v/dashboard/panel/definitions/panel"

export async function analytics() {
    return await http.get<{ data: AnalyticsData }>("dashboard/panel/analytics")
}
