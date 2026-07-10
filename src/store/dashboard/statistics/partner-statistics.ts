import { defineStore } from "pinia"
import { useListQuery } from "@/composables/store/use-list-query"
import { formatDateToString, getPreviousMonth } from "@/lib/date-helpers"

export interface PartnerStatisticsFilters {
    partner_id: number | null
    date:       string | null
}

export const usePartnerStatisticsStore = defineStore("dashboard-partner-statistics", () => {
    return useListQuery<PartnerStatisticsFilters>({
        search:  "",
        filters: {
            partner_id: null,
            date:       formatDateToString(getPreviousMonth(), true),
        },
        sortBy: "name",
    })
})
