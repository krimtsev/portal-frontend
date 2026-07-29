import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface TicketFilters {
    department_id: string[]
    partner_id:    string[]
    state:         string[]
}

export const useTicketsStore = defineStore("dashboard-tickets", () => {
    return usePagination<TicketFilters>({
        search:  "",
        filters: {
            department_id: [],
            partner_id:    [],
            state:         [],
        },
    })
})
