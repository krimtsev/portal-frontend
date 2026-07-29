import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"
import {
    formatJSDateToStartDateString,
    getPreviousMonthJSDate,
} from "@/lib/date-helpers"

export interface RoyaltyFilters {
    partner_id: number[]
    date:       string | null
}

export const useRoyaltyStore = defineStore("dashboard-royalty", () => {
    return usePagination<RoyaltyFilters>({
        search:  "",
        filters: {
            partner_id: [],
            date:       formatJSDateToStartDateString(getPreviousMonthJSDate()),
        },
        sortBy: "name",
    })
})
