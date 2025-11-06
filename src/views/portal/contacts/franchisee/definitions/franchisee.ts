export interface FranchiseeItemRaw {
    id: string
    name: string
    telnums: FranchiseeTelnums[] | null
}

export interface FranchiseeTelnums {
    number: string
    name: string
}

export interface FranchiseeItem {
    id: string
    filial: string
    names: string[]
    telnums: string[]
}

export enum FranchiseeSortBy {
    Name = "name"
}
