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
