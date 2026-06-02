import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"


export const usePartnerGroupsStore = defineStore("partnerGroups", () => {
    return usePagination({
        search:  "",
        filters: {},
    })
})
