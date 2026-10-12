import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { TelnumsIncomingItem } from "@v/dashboard/telnums/telnums-incoming/definitions/telnums-incoming"
import type { TelnumsIncomingFilters } from "@s/dashboard/telnums/telnums-incoming"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel"

export async function list(paginationFilter: PaginationFilter<TelnumsIncomingFilters>) {
    return await http.post<Pagination<TelnumsIncomingItem[]>>("dashboard/telnums/incoming/list", paginationFilter)
}

export async function partnerDay(partnerId: number, params: { date: string }) {
    return await http.get<{ data: MangoCallsData[] }>(`dashboard/telnums/incoming/${partnerId}/hourly`, { params })
}
