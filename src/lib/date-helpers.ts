import { DateTime } from "luxon"

/**
 * Статическая дата: 01-01-2026
 * Техническая данны начала сбора статистики
 */
export function getAnalyticsStartDate(): Date {
    return DateTime.fromISO("2026-01-01", { zone: "utc" }).toJSDate()
}

// Текущий день (сегодня)
export function getTodayDate(): Date {
    return DateTime.utc().toJSDate()
}

// Вчера (текущий день - 1 день)
export function getYesterdayDate(): Date {
    return DateTime.utc()
        .minus({ days: 1 })
        .toJSDate()
}

/**
 * Генерирует дефолтный период [Начало месяца, Вчера]
 * Если сегодня 1 число, вернет период за весь прошлый месяц
 */
export function getMonthToYesterdayRange(): [Date, Date] {
    const yesterday = DateTime.utc().minus({ days: 1 })
    const startOfMonth = yesterday.startOf("month")

    return [startOfMonth.toJSDate(), yesterday.toJSDate()]
}

export function getPreviousMonth(): Date {
    const baseDate = DateTime.utc().minus({ months: 1 })
    const startOfMinusMonth = baseDate.startOf("month")
    return startOfMinusMonth.toJSDate()
}
