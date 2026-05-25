import { DateTime } from "luxon"

/**
 * Статическая дата: 01-01-2026
 * Техническая данны начала сбора статистики
 */
export function getAnalyticsStartDate(): Date {
    return DateTime.fromISO("2026-01-01").toJSDate()
}

// Текущий день (сегодня)
export function getTodayDate(): Date {
    return DateTime.now().toJSDate()
}

// Вчера (текущий день - 1 день)
export function getYesterdayDate(): Date {
    return DateTime.now()
        .minus({ days: 1 })
        .toJSDate()
}

/**
 * Генерирует дефолтный период [Начало месяца, Вчера]
 * Если сегодня 1 число, вернет период за весь прошлый месяц
 */
export function getMonthToYesterdayRange(): [Date, Date] {
    const yesterday = DateTime.now().minus({ days: 1 })
    const startOfMonth = yesterday.startOf("month")

    return [startOfMonth.toJSDate(), yesterday.toJSDate()]
}
