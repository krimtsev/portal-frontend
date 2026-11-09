import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface BankDetailsFilters {
    user_id:    number | null
    partner_id: number | null
}

export const useBankDetailsStore = defineStore("dashboard-bank-details", () => {
    return usePagination<BankDetailsFilters>({
        search:  "",
        filters: {
            user_id:    null,
            partner_id: null,
        },
        sortBy: "name",
    })
})
