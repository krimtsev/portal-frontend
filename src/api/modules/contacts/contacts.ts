import type { FranchiseeItemRaw } from "@v/portal/contacts/franchisee/definitions/franchisee"
import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"

export async function get(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<FranchiseeItemRaw[]>>("contacts/franchisee", paginationFilter)
}
