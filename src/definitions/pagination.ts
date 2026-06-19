export interface ListQueryFilter<T = Record<string, string[] | boolean[] | number[]>> {
    sortBy:    string
    sortOrder: string
    search:    string
    filters:   T
}

export interface PaginationFilter<T = Record<string, string[] | boolean[] | number[]>> extends ListQueryFilter<T> {
    page:    number
    perPage: number
}

export interface PaginationPage {
    currentPage: number
    lastPage:    number
    perPage:     number
    total:       number
    from:        number
    to:          number
}

export interface Pagination<T>{
    list: T
    page: PaginationPage
}

export function defaultListQueryFilter<T>(
    params: Partial<ListQueryFilter<T>> = {},
): ListQueryFilter<T> {
    return {
        sortBy:    "id",
        sortOrder: "asc",
        search:    "",
        filters:   {} as unknown as T,
        ...params,
    }
}

export function defaultPaginationFilter<T = Record<string, string[] | boolean[] | number[]>>(
    params: Partial<PaginationFilter<T>> = {},
): PaginationFilter<T> {
    return {
        page:      1,
        sortBy:    "id",
        sortOrder: "asc",
        perPage:   20,
        search:    "",
        filters:   {} as unknown as T,
        ...params,
    }
}

export function defaultPaginationPage(params: Partial<PaginationPage> = {}): PaginationPage {
    return {
        currentPage: 1,
        lastPage:    1,
        perPage:     20,
        total:       0,
        from:        0,
        to:          0,
        ...params,
    }
}
