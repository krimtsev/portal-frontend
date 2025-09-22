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
}


export function defaultPaginationFilter(): PaginationFilter {
    return {
        page: 1,
        sortBy: "asc",
        sortOrder: "id",
        perPage: 20,
        search: ""
    }
}

export function defaultPaginationPage(): PaginationPage {
    return {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
        from: 0,
        to: 0,
    }
}
