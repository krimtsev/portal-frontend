import { cloneDeep, isEqual } from "lodash"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

import {
    defaultPaginationFilter,
    defaultPaginationPage,
    type PaginationFilter,
    type PaginationPage,
} from "@/definitions/pagination.ts"

export const useUsersStore = defineStore("users", () => {
    const isLoading = ref<boolean>(false)

    const initialFilter = ref(
        defaultPaginationFilter({
            search:  "",
            filters: {
                partner_id:    [],
                department_id: [],
                disabled:      [],
                role:          [],
                access:        [],
            },
        }),
    )

    const currentFilter = ref<PaginationFilter>(
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
