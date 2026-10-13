import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"
import {
    getTodayDateString,
} from "@/lib/date-helpers"

export interface TelnumsIncomingFilters {
    partner_id: number | null
    date_from:  string | null
    date_to:    string | null
}

export const useTelnumsIncomingStore = defineStore("profile-telnums-incoming", () => {
    return usePagination<TelnumsIncomingFilters>({
        search:  "",
        filters: {
            partner_id: null,
            date_from:  getTodayDateString(),
            date_to:    getTodayDateString(),
        },
        sortBy: "name",
    })
})
