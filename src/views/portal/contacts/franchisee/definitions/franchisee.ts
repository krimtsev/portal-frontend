export interface FranchiseeItemRaw {
    id: string
    name: string
    telnums: string | null // FranchiseeTelnums
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
