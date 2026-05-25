import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"

export interface TicketFilters {
    department_id: string[]
    partner_id:    string[]
    state:         string[]
}

export const useTicketsStore = defineStore("tickets", () => {
    return usePagination<TicketFilters>({
        search:  "",
        filters: {
            department_id: [],
            partner_id:    [],
            state:         [],
        },
    })
})
