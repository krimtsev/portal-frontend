import { http } from "@/api"
import type { FranchiseeItemRaw } from "@v/portal/contacts/franchisee/definitions/franchisee"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"

export async function get(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<FranchiseeItemRaw[]>>("contacts/franchisee", paginationFilter)
}
