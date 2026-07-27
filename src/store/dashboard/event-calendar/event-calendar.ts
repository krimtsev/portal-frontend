import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export const useEventCalendarStore = defineStore("event-calendar", () => {
    return usePagination({
        search:    "",
        filters:   {},
        sortBy:    "start_at",
        sortOrder: "desc",
    })
})
