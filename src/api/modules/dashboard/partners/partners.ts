import type {
    PartnerData,
    PartnerResponse,
} from "@v/dashboard/partners/edit/definitions/partner"
import type {
    PartnerListItem,
    PartnerOptionsResponse,
    PartnersExportData,
} from "@v/dashboard/partners/list/definitions/partners"
import { http } from "@/api"
import type {
    Pagination,
    PaginationFilter,
} from "@/shared/pagination/pagination"

export async function options() {
    return await http.get<PartnerOptionsResponse>("dashboard/partners/options")
}

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<PartnerListItem[]>>("dashboard/partners/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<PartnerResponse>(`dashboard/partners/partner/${id}`)
}

export async function create(id: string, data: PartnerData) {
    return await http.post<null>(`dashboard/partners/partner/${id}`, data)
}

export async function update(id: string, data: PartnerData) {
    return await http.put<null>(`dashboard/partners/partner/${id}`, data)
}

export async function exportData() {
    return await http.get<PartnersExportData[]>("dashboard/partners/export")
}
