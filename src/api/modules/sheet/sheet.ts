import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/shared/pagination/pagination"
import type { CertificateItem } from "@v/portal/certificates/definitions/certificates"

export async function get(paginationFilter: PaginationFilter) {
    return await http.get<Pagination<CertificateItem[]>>("certificates", { params: paginationFilter })
}
