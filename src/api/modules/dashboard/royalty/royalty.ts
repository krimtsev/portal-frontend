import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { RoyaltyFilters } from "@s/dashboard/royalty/royalty-percent.ts"
import type { RoyaltyListItem } from "@v/dashboard/royalty/percent/definitions/royalty-percent"
import type {
    RoyaltyRecordsData,
} from "@v/dashboard/royalty/records/definitions/royalty-records"
import type { RoyaltyRecordsFilters } from "@s/dashboard/royalty/royalty-records"

export async function percentList(paginationFilter: PaginationFilter<RoyaltyFilters>) {
    return await http.post<Pagination<RoyaltyListItem[]>>("dashboard/royalty/percent/list", paginationFilter)
}

export async function recordsList(filter: PaginationFilter<RoyaltyRecordsFilters>) {
    return await http.post<RoyaltyRecordsData>("dashboard/royalty/records/list", filter)
}
