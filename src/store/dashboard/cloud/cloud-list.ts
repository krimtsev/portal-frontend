import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export const useCloudListStore = defineStore("cloudList", () => {
    return usePagination({
        search:  "",
        filters: {},
    })
})
