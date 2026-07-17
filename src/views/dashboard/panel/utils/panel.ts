import { PeriodOptions } from "@/definitions/period"
import i18n from "@/plugins/i18n"
import type { AnalyticsData } from "@v/dashboard/panel/definitions/panel"

export function defaultAnalyticsData(): AnalyticsData {
    return {
        tickets: {
            new_count:     0,
            pending_count: 0,
            total_count:   0,
        },
        partners: {
            total_count:    0,
            active_count:   0,
            inactive_count: 0,
        },
        efficiency: {
            success_rate_percentage: 0,
            average_time:            0,
        },
        periods: {
            [PeriodOptions.Day]: {
                current:  0,
                previous: 0,
            },
            [PeriodOptions.SevenDays]: {
                current:  0,
                previous: 0,
            },
            [PeriodOptions.ThirtyDays]: {
                current:  0,
                previous: 0,
            },
        },
        royalty_stats: [],
        jobs:          {
            total_count:    0,
            default_count:  0,
            yclients_count: 0,
            failed_count:   0,
        },
    }
}

export const periodOptions: { id: PeriodOptions, name: string }[] = [
    {
        id:   PeriodOptions.Day,
        name: i18n.global.t("mc.common.periodDays", 1),
    },
    {
        id:   PeriodOptions.SevenDays,
        name: i18n.global.t("mc.common.periodDays", 7),
    },
    {
        id:   PeriodOptions.ThirtyDays,
        name: i18n.global.t("mc.common.periodDays", 30),
    },
]
