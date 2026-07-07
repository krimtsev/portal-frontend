interface TotalStatistics {
    income_total:               number
    fullness_percent:           number
    client_new:                 number
    client_return:              number
    retention_percent:          number
    rating_total:               number
    rating_best:                number
    additional_services:        number
    transaction_sales:          number
    services_with_transactions: number
    transaction_loyalty:        number
    average_sum:                number
    work_days_count:            number
    services_per_visit:         number
}

export interface TotalCompareStatistics extends TotalStatistics {
    growth: TotalStatistics
}
