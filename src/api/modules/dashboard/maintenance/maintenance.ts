import { http } from "@/api"
import type { MaintenanceData } from "@v/dashboard/settings/maintenance/definitions/maintenance"

export async function get() {
    return await http.get<{ data: MaintenanceData }>("dashboard/settings/maintenance")
}

export async function update(data: MaintenanceData) {
    return await http.put<null>("dashboard/settings/maintenance", data)
}
