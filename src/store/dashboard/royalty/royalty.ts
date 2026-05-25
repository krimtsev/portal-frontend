import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"

export interface RoyaltyFilters {
    period: [Date, Date] | []
}

export const useRoyaltyStore = defineStore("royalty", () => {
    return usePagination<RoyaltyFilters>({
        search:  "",
        filters: {
            period: [],
        },
    })
})
