export interface PartnerGroupOptionItem {
    id:   number,
    title: string
}

export interface PartnerGroupOptionsResponse {
    list: PartnerGroupOptionItem[]
}

export interface PartnerGroupsListItem {
    id:     number,
    title:  string,
    total:  number,
}
