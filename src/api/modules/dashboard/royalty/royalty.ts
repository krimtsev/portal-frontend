import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { RoyaltyFilters } from "@s/dashboard/royalty/royalty"
import type { RoyaltyListItem } from "@v/dashboard/royalty/list/definitions/royalty-list"

export async function list(paginationFilter: PaginationFilter<RoyaltyFilters>) {
    return await http.post<Pagination<RoyaltyListItem[]>>("dashboard/royalty/list", paginationFilter)
}

export async function exportData() {
    return await http.get<RoyaltyListItem[]>("dashboard/royalty/export")
}
