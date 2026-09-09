export interface RoyaltyRecordsItem {
    staff: {
        staff_id:       number
        name:           string
        specialization: string
        avatar:         string
    }
    data: number[]
}

export interface RoyaltyRecordsData {
    list:   RoyaltyRecordsItem[]
    totals: number[]
}
