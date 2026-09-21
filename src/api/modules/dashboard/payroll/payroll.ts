import type { Pagination, PaginationFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { PayrollPartnerFilters } from "@s/dashboard/payroll/payroll-partner.ts"
import type { PayrollStaffData } from "@v/dashboard/payroll/staff/definitions/payroll-staff"
import type { PayrollStaffFilters } from "@s/dashboard/payroll/payroll-staff"
import type {
    PayrollPartnerItem,
} from "@v/dashboard/payroll/partner/definitions/payroll-partner"

export async function partnerList(paginationFilter: PaginationFilter<PayrollPartnerFilters>) {
    return await http.post<Pagination<PayrollPartnerItem[]>>("dashboard/payroll/partner/list", paginationFilter)
}

export async function staffList(paginationFilter: PaginationFilter<PayrollStaffFilters>) {
    return await http.post<{ data: PayrollStaffData }>("dashboard/payroll/staff/list", paginationFilter)
}
