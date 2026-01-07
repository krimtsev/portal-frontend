import { http } from "@/api"
import type { TicketCategoriesResponse } from "@v/profile/tickets/edit/definitions/ticket-category"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<TicketListItem[]>>("dashboard/tickets/list", paginationFilter)
}

export async function categories() {
    return await http.get<TicketCategoriesResponse>("dashboard/ticket-categories/list")
}
