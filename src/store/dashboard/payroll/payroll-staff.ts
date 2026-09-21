import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PayrollStaffFilters {
    partner_id: number | null
    start_date: string | null
    end_date:   string | null
}

export const usePayrollStaffStore = defineStore("dashboard-payroll-staff", () => {
    return usePagination<PayrollStaffFilters>({
        search:  "",
        filters: {
            partner_id: null,
            start_date: null,
            end_date:   null,
        },
        sortBy: "name",
    })
})
