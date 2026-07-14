import type { MonthsBarChartData } from "@c/charts/definitions/charts"

export interface StaffStatisticsGrowth {
    additional_services:        number
    average_sum:                number
    client_new:                 number
    fullness_percent:           number
    income_total:               number
    rating_best:                number
    rating_total:               number
    retention_percent:          number
    services_with_transactions: number
    transaction_loyalty:        number
    transaction_sales:          number
    work_days_count:            number
}

export interface StaffStatisticsData {
    name:                       string
    firstname:                  string
    surname:                    string
    avatar:                     string
    average_sum:                number
    additional_services:        number
    client_new:                 number
    fullness_percent:           number
    income_total:               number
    income_goods:               number
    rating_best:                number
    rating_total:               number
    record_completed:           number
    retention_percent:          number
    services_with_transactions: number
    specialization:             string
    staff_id:                   number
    transaction_loyalty:        number
    transaction_sales:          number
    work_days_count:            number
    services_per_visit:         number
}

export interface StaffStatisticsItem extends StaffStatisticsData {
    growth: StaffStatisticsGrowth
}

export interface StaffDetailsRequest {
    partner_id: number
    staff_id:   number
    date:       string
}

export interface StaffDetails {
    id:               number
    name:             string
    specialization:   string
    avatar_big:       string
    client_new:       number
    client_return:    number
    client_active:    number
    fullness_percent: number

    work_days: number
    date:      string

    history: {
        additional_services: MonthsBarChartData
        average_sum:         MonthsBarChartData
        income_goods:        MonthsBarChartData
    }
}
