import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PayrollPartnerFilters {
    partner_id: number[]
    start_date: string | null
    end_date:   string | null
}

export const usePayrollPartnerStore = defineStore("dashboard-payroll-partner", () => {
    return usePagination<PayrollPartnerFilters>({
        search:  "",
        filters: {
            partner_id: [],
            start_date: null,
            end_date:   null,
        },
        sortBy: "name",
    })
})
