import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { PromotionsFilters } from "@s/dashboard/promotions/promotions"
import type { PromotionExportItem, PromotionListItem } from "@v/dashboard/promotions/list/definitions/promotions"
import type { PromotionFormData, PromotionResponse } from "@v/dashboard/promotions/edit/definitions/promotion"
import { toFormData } from "@v/dashboard/promotions/edit/utils/promotion"

export async function list(paginationFilter: PaginationFilter<PromotionsFilters>) {
    return await http.post<Pagination<PromotionListItem[]>>("dashboard/promotions/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<PromotionResponse>(`dashboard/promotions/event/${id}`)
}

export async function create(data: PromotionFormData) {
    return await http.post<null>("dashboard/promotions/event", toFormData(data))
}

export async function update(id: string, data: PromotionFormData) {
    return await http.post<null>(`dashboard/promotions/event/${id}`, toFormData(data))
}

export async function remove(id: string) {
    return await http.delete<null>(`dashboard/promotions/event/${id}`)
}

export async function exportData() {
    return await http.get<PromotionExportItem[]>("dashboard/promotions/export")
}
