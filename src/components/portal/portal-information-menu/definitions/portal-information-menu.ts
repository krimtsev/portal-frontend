export interface SectionItem {
    label: string
    path?: string
    active?: boolean
    external?: string
}

export interface Section {
    title: string
    items: SectionItem[]
}
