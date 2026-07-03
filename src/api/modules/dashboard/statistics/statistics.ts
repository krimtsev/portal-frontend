import type { ListQueryFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { PartnerStatisticsFilters } from "@s/dashboard/statistics/partner-statistics"
import type { StaffStatisticsItem } from "@v/dashboard/statistics/staff-statistics/definitions/statistic-staff"
import type { MonthsBarChartData } from "@c/charts/definitions/charts"

export async function getStaffList(params: ListQueryFilter<PartnerStatisticsFilters>) {
    return await http.get<{ list: StaffStatisticsItem[] }>("dashboard/statistics/staff/list", { params })
}

export async function getPartnerIncome(params: ListQueryFilter<PartnerStatisticsFilters>) {
    return await http.get<{ list: MonthsBarChartData }>("dashboard/statistics/partner/income", { params })
}
