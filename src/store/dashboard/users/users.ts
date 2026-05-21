import { cloneDeep, isEqual } from "lodash"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

import {
    defaultPaginationFilter,
    defaultPaginationPage,
    type PaginationFilter,
    type PaginationPage,
} from "@/definitions/pagination"

export interface UserFilters {
    partner_id:    number[]
    department_id: number[]
    disabled:      boolean | null
    role:          string[]
    access:        string[]
}

export const useUsersStore = defineStore("users", () => {
    const isLoading = ref<boolean>(false)

    const initialFilter = ref<PaginationFilter<UserFilters>>(
        defaultPaginationFilter({
            search:  "",
            filters: {
                partner_id:    [],
                department_id: [],
                disabled:      null,
                role:          [],
                access:        [],
            },
        }),
    )

    const currentFilter = ref<PaginationFilter<UserFilters>>(
        cloneDeep(initialFilter.value),
    )

    const pagination = ref(defaultPaginationPage({ perPage: 20 }))

    function setIsLoading(value: boolean) {
        isLoading.value = value
    }

    function setPagination(value: PaginationPage) {
        pagination.value = value
    }

    function setPage(value: number) {
        currentFilter.value.page = value
    }

    function resetPage() {
        currentFilter.value.page = 1
    }

    const isChanged = computed(() => {
        return !isEqual(currentFilter.value, initialFilter.value)
    })

    function commitFilter() {
        initialFilter.value = cloneDeep(currentFilter.value)
    }

    const isShowPagination = computed(() => {
        return !isLoading.value && pagination.value.total > pagination.value.perPage
    })

    return {
        filter: currentFilter,
        pagination,

        setIsLoading,
        setPagination,
        setPage,
        resetPage,
        commitFilter,

        isLoading,
        isChanged,
        isShowPagination,
    }
})
