import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"
import { getPreviousMonth } from "@/lib/date-helpers"

export interface RoyaltyFilters {
    partner_id: number[]
    date:       Date | null
}

export const useRoyaltyStore = defineStore("royalty", () => {
    return usePagination<RoyaltyFilters>({
        search:  "",
        filters: {
            partner_id: [],
            date:       getPreviousMonth(),
        },
        sortBy: "name",
    })
})
