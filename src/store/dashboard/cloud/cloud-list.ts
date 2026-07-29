import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export const useCloudListStore = defineStore("dashboard-cloud-list", () => {
    return usePagination({
        search:  "",
        filters: {},
    })
})
