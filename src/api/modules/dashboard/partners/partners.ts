import { http } from "@/api"
import type {
    PartnerListItem,
    PartnerShortListResponse
} from "@v/dashboard/partners/list/definitions/partners"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"

export async function shortList() {
    return await http.get<PartnerShortListResponse>("dashboard/partners/short-list")
}

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<PartnerListItem[]>>("dashboard/partners/list", paginationFilter)
}
