import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination.ts"


export const usePartnerGroupsStore = defineStore("partnerGroups", () => {
    return usePagination({
        search:  "",
        filters: {},
    })
})
