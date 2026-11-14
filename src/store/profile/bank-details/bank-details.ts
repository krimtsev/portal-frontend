import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface BankDetailsFilters {
    partner_id: number | null
}

export const useBankDetailsStore = defineStore("profile-bank-details", () => {
    return usePagination<BankDetailsFilters>({
        search:  "",
        filters: {
            partner_id: null,
        },
        sortBy: "name",
    })
})
