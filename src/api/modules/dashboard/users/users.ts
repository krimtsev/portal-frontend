import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import { http } from "@/api"
import type { UsersListItem } from "@v/dashboard/users/list/definitions/users-list"

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<UsersListItem[]>>("dashboard/users/list", paginationFilter)
}
