import type {
    PartnerNotificationData,
} from "@v/dashboard/partners/notifications/edit/definitions/partner-notification"
import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type {
    PartnerNotificationsListItem,
} from "@v/dashboard/partners/notifications/list/definitions/partner-notifications"
import type { PartnerNotificationFilters } from "@s/dashboard/partners/partner-notifications"

export async function list(paginationFilter: PaginationFilter<PartnerNotificationFilters>) {
    return await http.post<Pagination<PartnerNotificationsListItem[]>>("dashboard/partner-notifications/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<{ data: PartnerNotificationData }>(`dashboard/partner-notifications/partner/${id}`)
}

export async function update(id: string, data: PartnerNotificationData) {
    return await http.put<null>(`dashboard/partner-notifications/partner/${id}`, data)
}


