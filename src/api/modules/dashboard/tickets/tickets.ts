import type { TicketStateData } from "@v/dashboard/tickets/edit/definitions/ticket"
import type { TicketsExportData } from "@v/dashboard/tickets/list/definitions/tickets"
import type { TicketResponse } from "@v/profile/tickets/edit/definitions/ticket"
import type { TicketCategoriesResponse } from "@v/profile/tickets/edit/definitions/ticket-category"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"

import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"

export async function categories() {
    return await http.get<TicketCategoriesResponse>("dashboard/ticket-categories/list")
}

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<TicketListItem[]>>("dashboard/tickets/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<TicketResponse>(`dashboard/tickets/ticket/${id}`)
}

export async function update(id: string | number, params: TicketStateData) {
    return await http.post<TicketResponse>(`dashboard/tickets/ticket/${id}`, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export async function download(id: string | number, name: string) {
    return await http.getFile({
        fileName: name,
        url:      `dashboard/tickets/ticket/${id}/download`,
    })
}

export async function exportData() {
    return await http.get<TicketsExportData[]>("dashboard/tickets/export")
}
