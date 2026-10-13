import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"
import {
    getTodayDateString,
} from "@/lib/date-helpers"

export interface TelnumsIncomingFilters {
    partner_id: number[]
    date_from:  string | null
    date_to:    string | null
}

export const useTelnumsIncomingStore = defineStore("dashboard-telnums-incoming", () => {
    return usePagination<TelnumsIncomingFilters>({
        search:  "",
        filters: {
            partner_id: [],
            date_from:  getTodayDateString(),
            date_to:    getTodayDateString(),
        },
        sortBy:    "name",
        sortOrder: "asc",
    })
})
