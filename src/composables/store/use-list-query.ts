import { useQueryState } from "@/composables/store/use-query-state"

export interface ListQueryFilter<T> {
    sortBy:    string
    sortOrder: string
    search:    string
    filters:   T
}

export interface ListQueryOptions<T> {
    search?:    string
    filters?:   T
    sortBy?:    string
    sortOrder?: string
}

export function useListQuery<T>(options: ListQueryOptions<T> = {}) {
    return useQueryState<ListQueryFilter<T>>({
        sortBy:    options.sortBy ?? "id",
        sortOrder: options.sortOrder ?? "asc",
        search:    options.search ?? "",
        filters:   (options.filters ?? {}) as T,
    })
}
