import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
    defaultPaginationFilter,
    defaultPaginationPage,
    type PaginationPage,
} from "@/shared/pagination/pagination.ts"
import { isEqual, cloneDeep } from "lodash"

export const useTicketsStore = defineStore("tickets", () => {
    const isLoading = ref<boolean>(false)

    const initialFilter = ref(
        defaultPaginationFilter({
            filters: {
                category_id: [],
                partner_id: [],
                state: [],
            },
        }),
    )

    const currentFilter = cloneDeep(initialFilter)

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
        isShowPagination
    }
})
