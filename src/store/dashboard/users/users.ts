import { defineStore } from "pinia"
import { usePagination } from "@/composables/store/use-pagination"

export interface UserFilters {
    partner_id:    number[]
    department_id: number[]
    disabled:      boolean | null
    role:          string[]
    access:        string[]
}

export const useUsersStore = defineStore("users", () => {
    return usePagination<UserFilters>({
        search:  "",
        filters: {
            partner_id:    [],
            department_id: [],
            disabled:      null,
            role:          [],
            access:        [],
        },
    })
})
