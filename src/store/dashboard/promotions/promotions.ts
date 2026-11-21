import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PromotionsFilters {
    disabled: boolean | null
}

export const usePromotionsStore = defineStore("dashboard-promotions", () => {
    return usePagination<PromotionsFilters>({
        search:  "",
        filters: {
            disabled: null,
        },
        sortBy: "name",
    })
})
