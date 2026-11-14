import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import type { BankDetailsFilters } from "@s/profile/bank-details/bank-details"
import type {
    BankDetailListItem,
} from "@v/profile/bank-details/list/definitions/bank-details"
import type {
    BankDetailData, BankDetailOptionsResponse,
    BankDetailResponse,
} from "@v/profile/bank-details/edit/definitions/bank-detail"


export async function list(paginationFilter: PaginationFilter<BankDetailsFilters>) {
    return await http.post<Pagination<BankDetailListItem[]>>("bank-detail/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<BankDetailResponse>(`bank-detail/record/${id}`)
}

export async function create(id: string, data: BankDetailData) {
    return await http.post<null>(`bank-detail/record/${id}`, data)
}

export async function update(id: string, data: BankDetailData) {
    return await http.put<null>(`bank-detail/record/${id}`, data)
}

export async function remove(id: string) {
    return await http.delete<null>(`bank-detail/record/${id}`)
}

export async function options() {
    return await http.get<BankDetailOptionsResponse>("bank-detail/options")
}
