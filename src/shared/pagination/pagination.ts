export interface Pagination<T>{
    list: T,
    page: PaginationPage
}

export interface PaginationPage {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    from: number
    to: number
}

export interface PaginationFilter {
    page: number,
    sortBy: string,
    sortOrder: string,
    perPage: number,
    search: string,
    filters: Record<string, string[]>,
}


export function defaultPaginationFilter(params: Partial<PaginationFilter> = {}): PaginationFilter {
    return {
        page: 1,
        sortBy: "id",
        sortOrder: "asc",
        perPage: 20,
        search: "",
        filters: {},
        ...params
    }
}

export function defaultPaginationPage(params: Partial<PaginationPage> = {}): PaginationPage {
    return {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
        from: 0,
        to: 0,
        ...params
    }
}
