import { defineStore } from "pinia"
import { useListQuery } from "@/composables/store/use-list-query"
import { formatDateToString, getPreviousMonth } from "@/lib/date-helpers"

export interface StatisticsStaffFilters {
    partner_id: number | null
    date:       string | null
}

export const useStatisticsStaffStore = defineStore("statisticsStaff", () => {
    return useListQuery<StatisticsStaffFilters>({
        search:  "",
        filters: {
            partner_id: null,
            date:       formatDateToString(getPreviousMonth(), true),
        },
        sortBy: "name",
    })
})
