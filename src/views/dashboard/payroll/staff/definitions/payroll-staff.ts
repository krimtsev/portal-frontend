export interface PayrollStaffItem {
    id:                number
    name:              string
    specialization:    string
    sum:               number
    daily_sums?:       Record<string, number>
    partner_turnover?: number
}

export interface PayrollStaffData {
    staff:    PayrollStaffItem[]
    turnover: number
}

