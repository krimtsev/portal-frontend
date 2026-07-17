import { PeriodOptions } from "@/definitions/period"

export interface AnalyticsData {
    tickets:       TicketsData
    partners:      ActivityData
    efficiency:    TicketsEfficiencyData
    periods:       TicketsPeriodsData
    royalty_stats: RoyaltyStats[]
    jobs:          JobsData
}

export interface TicketsData {
    new_count:     number
    pending_count: number
    total_count:   number
}

export interface ActivityData {
    active_count:   number
    inactive_count: number
    total_count:    number
}

export interface TicketsEfficiencyData {
    success_rate_percentage: number
    average_time:            number
}

interface TicketsPeriodsValue {
    current:  number
    previous: number
}

export interface TicketsPeriodsData {
    [PeriodOptions.Day]:        TicketsPeriodsValue
    [PeriodOptions.SevenDays]:  TicketsPeriodsValue
    [PeriodOptions.ThirtyDays]: TicketsPeriodsValue
}

export interface RoyaltyStats {
    income_total:   number
    royalty_amount: number
    month:          string
}

export interface JobsData {
    total_count:    number
    default_count:  number
    yclients_count: number
    failed_count:   number
}
