import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import { http } from "@/api"
import type { UsersListItem } from "@v/dashboard/users/list/definitions/users-list"
import type { UserData, UserResponse } from "@v/dashboard/users/edit/definitions/user"

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<UsersListItem[]>>("dashboard/users/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<UserResponse>(`dashboard/users/user/${id}`)
}

export async function create(id: string, data: UserData) {
    return await http.post<null>(`dashboard/users/user/${id}`, data)
}

export async function update(id: string, data: UserData) {
    return await http.put<null>(`dashboard/users/user/${id}`, data)
}
