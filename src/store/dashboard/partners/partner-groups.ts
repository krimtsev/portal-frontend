import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"


export const usePartnerGroupsStore = defineStore("dashboard-partner-groups", () => {
    return usePagination({
        search:  "",
        filters: {},
    })
})
