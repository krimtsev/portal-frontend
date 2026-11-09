import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { BankDetailsFilters } from "@s/dashboard/bank-details/bank-details"
import type {
    BankDetailExportResponse,
    BankDetailListItem,
} from "@v/dashboard/bank-details/list/definitions/bank-details"
import type { BankDetailData, BankDetailResponse } from "@v/dashboard/bank-details/edit/definitions/bank-detail"


export async function list(paginationFilter: PaginationFilter<BankDetailsFilters>) {
    return await http.post<Pagination<BankDetailListItem[]>>("dashboard/bank-detail/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<BankDetailResponse>(`dashboard/bank-detail/record/${id}`)
}

export async function create(data: BankDetailData) {
    return await http.post<null>("dashboard/bank-detail/record", data)
}

export async function update(id: string, data: BankDetailData) {
    return await http.put<null>(`dashboard/bank-detail/record/${id}`, data)
}

export async function remove(id: string) {
    return await http.delete<null>(`dashboard/bank-detail/record/${id}`)
}

export async function exportData() {
    return await http.get<BankDetailExportResponse>("dashboard/bank-detail/export")
}
