import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { PromoDialogsFilters } from "@s/dashboard/promo-dialogs/promo-dialogs"
import type { PromoDialogListItem } from "@v/dashboard/promo-dialogs/list/definitions/promo-dialogs"
import type { PromoDialogData, PromoDialogResponse } from "@v/dashboard/promo-dialogs/edit/definitions/promo-dialog"

export async function list(paginationFilter: PaginationFilter<PromoDialogsFilters>) {
    return await http.post<Pagination<PromoDialogListItem[]>>("dashboard/promo-dialog/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<PromoDialogResponse>(`dashboard/promo-dialog/dialog/${id}`)
}

export async function create(data: PromoDialogData) {
    return await http.post<null>("dashboard/promo-dialog/dialog", data)
}

export async function update(id: string, data: PromoDialogData) {
    return await http.put<null>(`dashboard/promo-dialog/dialog/${id}`, data)
}

export async function remove(id: string) {
    return await http.delete<null>(`dashboard/promo-dialog/dialog/${id}`)
}
