export interface Ticket {
    title: string
    partner_id: number | null
    category_id: number | null
    message: string
    files: File[]
}

export interface TicketItem extends Ticket {
    attributes: Record<string, string>
}

export interface TicketCategoriesItem {
    id: number
    title: string
    slug: string
}

export interface TicketCategoriesResponse {
    list: TicketCategoriesItem[]
}

export interface TicketCategoryResponse {
    data: TicketCategoriesItem
}

export interface TicketListItem {
    id: string
    title: string
    category: {
        id: number,
        title: string
    } | null
    partner: {
        id: number,
        title: string
    } | null
    user: {
        id: number,
        title: string
    } | null
    state: {
        key: string,
        value: string
    }
    attributes?: Record<string, string>
}

export enum TicketCategorySlug {
    FRANCHISE = "franchise",
    BUILD = "build",
    MARKETING = "marking",
    NETWORK_ADMIN = "network_admin",
    NETWORK_BARBERING = "network_barbering",
    COMMUNITY = "community",
    OFFICE_MANAGER = "office_manager",
    IT_DEPARTMENT = "it_department",
    ACCOUNTING = "accounting",
}
