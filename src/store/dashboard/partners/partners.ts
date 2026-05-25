import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"

export interface PartnerFilters {
    disabled: boolean | null
}

export const usePartnersStore = defineStore("partners", () => {
    return usePagination<PartnerFilters>({
        search:  "",
        filters: {
            disabled: null,
        },
    })
})
