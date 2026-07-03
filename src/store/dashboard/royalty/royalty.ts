import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"
import { formatDateToString, getPreviousMonth } from "@/lib/date-helpers"

export interface RoyaltyFilters {
    partner_id: number[]
    date:       string | null
}

export const useRoyaltyStore = defineStore("dashboard-royalty", () => {
    return usePagination<RoyaltyFilters>({
        search:  "",
        filters: {
            partner_id: [],
            date:       formatDateToString(getPreviousMonth(), true),
        },
        sortBy: "name",
    })
})
