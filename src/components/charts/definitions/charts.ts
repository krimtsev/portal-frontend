export interface MonthsBarChartData {
    [key: string]: {
        value:   number
        percent: number
    }
}

export interface ChartData {
    label:      string
    value:      number
    isMock:     boolean
    percent:    number
    isSkeleton: boolean
}
