import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"
import {
    formatJSDateToStartDateString,
    getPreviousMonthJSDate,
} from "@/lib/date-helpers"

export interface RoyaltyRecordsFilters {
    partner_id: number | null
    date:       string | null
}

export const useRoyaltyRecordsStore = defineStore("dashboard-royalty-records", () => {
    return usePagination<RoyaltyRecordsFilters>({
        search:  "",
        filters: {
            partner_id: null,
            date:       formatJSDateToStartDateString(getPreviousMonthJSDate()),
        },
        sortBy: "name",
    })
})
