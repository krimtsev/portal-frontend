import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { EventCalendarListItem } from "@v/dashboard/event-calendar/list/definitions/event-calendar-list"
import type { EventCalendarData } from "@v/dashboard/event-calendar/edit/definitions/event-calendar"

export async function list(paginationFilter: PaginationFilter) {
    return await http.get<Pagination<EventCalendarListItem[]>>("dashboard/event-calendar/list", { params: paginationFilter })
}

export async function get(batchId: string) {
    return await http.get<{ data: EventCalendarData }>(`dashboard/event-calendar/batch/${batchId}`)
}

export async function create(data: EventCalendarData) {
    return await http.post<null>("dashboard/event-calendar/batch", data)
}

export async function update(batchId: string | number, data: EventCalendarData) {
    return await http.put<null>(`dashboard/event-calendar/batch/${batchId}`, data)
}

export async function remove(batchId: string | number) {
    return await http.delete<null>(`dashboard/event-calendar/batch/${batchId}`)
}
