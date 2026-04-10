import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import { http } from "@/api"
import type {
    CloudListItem,
    CloudOptionsResponse,
} from "@v/dashboard/cloud/list/definitions/cloud-list"
import type {
    CloudResponse,
    CloudData,
    CloudOptionsTreeParams,
} from "@v/dashboard/cloud/edit/definitions/cloud"


export async function tree(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<CloudListItem[]>>("dashboard/cloud/tree", paginationFilter)
}

export async function options(params?: CloudOptionsTreeParams) {
    return await http.get<CloudOptionsResponse>("dashboard/cloud/options", { params })
}

export async function optionsTree(params?: CloudOptionsTreeParams) {
    return await http.get<CloudOptionsResponse>("dashboard/cloud/options-tree", { params })
}

export async function get(id: string) {
    return await http.get<CloudResponse>(`dashboard/cloud/folder/${id}`)
}

export async function create(id: string, data: CloudData) {
    return await http.post<null>(`dashboard/cloud/folder/${id}`, data)
}

export async function update(id: string, data: CloudData) {
    return await http.put<null>(`dashboard/cloud/folder/${id}`, data)
}

