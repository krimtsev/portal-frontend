import type { ListQueryFilter } from "@/definitions/pagination"
import { http } from "@/api"
import type { StatisticsStaffFilters } from "@s/dashboard/statistics/statistics-staff"
import type { StatisticsStaffItem } from "@v/dashboard/statistics/statistics-staff/definitions/statistic-staff"

export async function getStaffList(queryFilter: ListQueryFilter<StatisticsStaffFilters>) {
    return await http.post<{ list: StatisticsStaffItem[] }>("dashboard/statistics/staff/list", queryFilter)
}
