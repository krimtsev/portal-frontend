import { http } from "@/api"
import type {
    PartnerGroupOptionsResponse,
    PartnerGroupsListItem
} from "@v/dashboard/partner-groups/list/definitions/partner-groups"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type {
    PartnerGroupData,
    PartnerGroupResponse
} from "@v/dashboard/partner-groups/edit/definitions/partner-group"


export async function options() {
    return await http.get<PartnerGroupOptionsResponse>("dashboard/partner-groups/options")
}

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<PartnerGroupsListItem[]>>("dashboard/partner-groups/list", paginationFilter)
}

export async function get(id: string) {
    return await http.get<PartnerGroupResponse>(`dashboard/partner-groups/partner-group/${id}`)
}

export async function create(id: string, data: PartnerGroupData) {
    return await http.post<null>(`dashboard/partner-groups/partner-group/${id}`, data)
}

export async function update(id: string, data: PartnerGroupData) {
    return await http.put<null>(`dashboard/partner-groups/partner-group/${id}`, data)
}
