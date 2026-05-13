import type { FranchiseeItemRaw } from "@v/portal/contacts/franchisee/definitions/franchisee"

import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/definitions/pagination.ts"

export async function get(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<FranchiseeItemRaw[]>>("contacts/franchisee", paginationFilter)
}
