import { computed, ref } from "vue"
import { cloneDeep, isEqual } from "lodash"

import {
    defaultPaginationFilter,
    defaultPaginationPage,
    type PaginationFilter,
    type PaginationPage,
} from "@/definitions/pagination"

export interface PaginationOptions<T = Record<string, any>> {
    search?:  string
    filters?: T
    perPage?: number
}

export function usePagination<T>(options: PaginationOptions<T> = {}) {
    const isLoading = ref<boolean>(false)

    const initialFilter = ref<PaginationFilter<T>>(
        defaultPaginationFilter({
            search:  options.search ?? "",
            filters: (options.filters ?? {}) as T,
        }),
    )

    const currentFilter = ref<PaginationFilter<T>>(
        cloneDeep(initialFilter.value) as PaginationFilter<T>,
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
}
