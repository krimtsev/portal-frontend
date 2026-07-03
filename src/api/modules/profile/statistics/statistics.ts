import type { ListQueryFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { PartnerStatisticsFilters } from "@s/profile/statistics/partner-statistics"
import type {
    StaffDetails,
    StaffDetailsRequest,
    StaffStatisticsItem,
} from "@v/profile/statistics/staff-statistics/definitions/statistic-staff"
import type { CompanyStatistics } from "@/api/modules/profile/statistics/definitions/statistics"

export async function getStaffCompare(params: ListQueryFilter<PartnerStatisticsFilters>) {
    return await http.get<{ list: StaffStatisticsItem[] }>("profile/statistics/staff/compare", { params })
}

export async function getCompanyStats(params: ListQueryFilter<PartnerStatisticsFilters>) {
    return await http.get<{ data: CompanyStatistics }>("profile/statistics/company/stats", { params })
}

export async function getStaffDetails(params: StaffDetailsRequest) {
    return await http.get<{ data: StaffDetails }>("profile/statistics/staff/details", { params })
}
