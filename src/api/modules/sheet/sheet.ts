import type { CertificateItem } from "@v/portal/certificates/definitions/certificates"

import { http } from "@/api"
import type { Pagination, PaginationFilter } from "@/definitions/pagination.ts"

export async function get(paginationFilter: PaginationFilter) {
    return await http.post<Pagination<CertificateItem[]>>("certificates", paginationFilter)
}
