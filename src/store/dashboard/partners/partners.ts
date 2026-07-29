import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PartnerFilters {
    disabled: boolean | null
}

export const usePartnersStore = defineStore("dashboard-partners", () => {
    return usePagination<PartnerFilters>({
        search:  "",
        filters: {
            disabled: null,
        },
        sortBy: "name",
    })
})
