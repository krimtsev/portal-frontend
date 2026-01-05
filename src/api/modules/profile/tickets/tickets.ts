import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import type { TicketResponse } from "@v/profile/tickets/edit/definitions/ticket"
import type {
    TicketCategoriesResponse,
    TicketCategoryResponse
} from "@v/profile/tickets/edit/definitions/ticket-category"
import type { TicketBlacklist } from "@v/profile/tickets/create/blacklist/definitions/blacklist"
import type { TicketCertificate } from "@v/profile/tickets/create/certificate/definitions/certificate"
import type { TicketDesign } from "@v/profile/tickets/create/design/definitions/design"
import type { TicketGeneral } from "@v/profile/tickets/create/general/definitions/general"
import type { TicketSpecialist } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import { TicketCategorySlug } from "@v/profile/tickets/edit/definitions/ticket-category"

type TicketRequestParams = TicketBlacklist | TicketCertificate | TicketDesign | TicketGeneral | TicketSpecialist

export async function list(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<TicketListItem[]>>("profile/tickets", paginationFilter)
}

export async function categories() {
    return await http.get<TicketCategoriesResponse>("profile/ticket-categories")
}

export async function category(slug: TicketCategorySlug) {
    return await http.get<TicketCategoryResponse>(`profile/ticket-category/${slug}`)
}

export async function create(params: TicketRequestParams) {
    return await http.post<any>("profile/ticket", params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export async function get(id: string) {
    return await http.get<TicketResponse>(`profile/ticket/${id}`)
}

export async function updateMessage(id: string|number, params: TicketRequestParams) {
    return await http.post<TicketResponse>(`profile/ticket/${id}/message`, params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export async function remove(id: string|number) {
    return await http.delete<any>(`profile/ticket/${id}`)
}

export async function download(id: string|number, name: string) {
    return await http.get<Blob>(`profile/ticket/${id}/download/${name}`, {
        responseType: "blob",
    })
}
