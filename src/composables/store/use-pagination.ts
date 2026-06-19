import { computed, ref } from "vue"
import { useQueryState } from "@/composables/store/use-query-state"
import {
    defaultPaginationFilter,
    defaultPaginationPage,
    type PaginationFilter,
    type PaginationPage,
} from "@/definitions/pagination"

export interface PaginationOptions<T = Record<string, any>> {
    search?:    string
    filters?:   T
    perPage?:   number
    sortBy?:    string
    sortOrder?: string
}

export function usePagination<T>(options: PaginationOptions<T> = {}) {
    const baseFilter = defaultPaginationFilter({
        sortBy:    options.sortBy ?? "id",
        sortOrder: options.sortOrder ?? "asc",
        search:    options.search ?? "",
        filters:   (options.filters ?? {}) as T,
    })

    const queryState = useQueryState<PaginationFilter<T>>(baseFilter)

    const pagination = ref(defaultPaginationPage({ perPage: 20 }))

    function setPagination(value: PaginationPage) {
        pagination.value = value
    }

    function setPage(value: number) {
        queryState.filter.value.page = value
    }

    function resetPage() {
        queryState.filter.value.page = 1
    }

    const isShowPagination = computed(() => {
        return !queryState.isLoading.value && pagination.value.total > pagination.value.perPage
    })

    return {
        ...queryState,
        pagination,
        setPagination,
        setPage,
        resetPage,
        isShowPagination,
    }
}
