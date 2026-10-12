import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"
import {
    getTodayDateString,
} from "@/lib/date-helpers"

export interface TelnumsIncomingFilters {
    partner_id: number[]
    date:       string | null
}

export const useTelnumsIncomingStore = defineStore("dashboard-telnums-incoming", () => {
    return usePagination<TelnumsIncomingFilters>({
        search:  "",
        filters: {
            partner_id: [],
            date:       getTodayDateString(),
        },
        sortBy:    "name",
        sortOrder: "asc",
    })
})
