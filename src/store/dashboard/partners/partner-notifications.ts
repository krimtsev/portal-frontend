import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface PartnerNotificationFilters {
    disabled: boolean | null
}

export const usePartnerNotificationsStore = defineStore("dashboard-partner-notifications", () => {
    return usePagination<PartnerNotificationFilters>({
        search:  "",
        filters: {
            disabled: null,
        },
        sortBy:    "name",
        sortOrder: "asc",
    })
})
