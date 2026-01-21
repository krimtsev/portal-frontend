import { http } from "@/api"
import type { TicketCategoriesResponse } from "@v/profile/tickets/edit/definitions/ticket-category"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import type { TicketResponse } from "@v/profile/tickets/edit/definitions/ticket"
import type { TicketStateData } from "@v/dashboard/tickets/edit/definitions/ticket"

export async function categories() {
    return await http.get<TicketCategoriesResponse>("dashboard/ticket-categories/list")
}

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<TicketListItem[]>>("dashboard/tickets/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<TicketResponse>(`dashboard/tickets/ticket/${id}`)
}

export async function update(id: string|number, params: TicketStateData) {
    return await http.post<TicketResponse>(`dashboard/tickets/ticket/${id}`, params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export async function download(id: string|number, name: string) {
    return await http.get<Blob>(`dashboard/tickets/ticket/${id}/download/${name}`, {
        responseType: "blob",
    })
}
