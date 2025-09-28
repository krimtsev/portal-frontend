import { http } from "@/api"
import type { FranchiseeItemRaw } from "@v/portal/contacts/franchisee/definitions/franchisee"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"

export async function get(paginationFilter: PaginationFilter) {
    return await http.get<Pagination<FranchiseeItemRaw[]>>("contacts/franchisee", { params: paginationFilter })
}
