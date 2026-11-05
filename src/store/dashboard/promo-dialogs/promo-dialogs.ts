import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PromoDialogsFilters {
    disabled: boolean | null
}

export const usePromoDialogsStore = defineStore("dashboard-promo-dialogs", () => {
    return usePagination<PromoDialogsFilters>({
        search:  "",
        filters: {
            disabled: null,
        },
        sortBy: "name",
    })
})
