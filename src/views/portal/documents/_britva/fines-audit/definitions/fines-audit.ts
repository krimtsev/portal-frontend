export interface FinesAuditContent {
    text: string
    price: number
    point?: string
}

export interface FinesAuditData {
    id: number
    header: string
    content: FinesAuditContent[]
}
