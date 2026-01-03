import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type {
    TicketCategoriesResponse,
    TicketCategoryResponse,
    TicketListItem
} from "@v/profile/tickets/edit/definitions/ticket"
import type { TicketBlacklist } from "@v/profile/tickets/create/blacklist/definitions/blacklist"
import type { TicketCertificate } from "@v/profile/tickets/create/certificate/definitions/certificate"
import type { TicketDesign } from "@v/profile/tickets/create/design/definitions/design"
import type { TicketGeneral } from "@v/profile/tickets/create/general/definitions/general"
import type { TicketSpecialist } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import { TicketCategorySlug } from "@v/profile/tickets/edit/definitions/ticket"

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
    return await http.get<TicketListItem>(`profile/ticket/${id}`)
}

export async function update() {
    return await http.put<any>("profile/ticket/update")
}
