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

/**
 * Преобразует объект Date в локальную строку 'yyyy-MM-dd' без таймзоны
 * Выход: "2026-05-28"
 */
export function formatDateToString(date: Date | null, isMonthView = false): string | null {
    if (!date) return null

    let dt = DateTime.fromJSDate(date)
    if (isMonthView) {
        dt = dt.startOf("month")
    }

    return dt.toFormat("yyyy-MM-dd")
}

/**
 * Парсит строку 'yyyy-MM-dd' обратно в локальный объект Date
 */
export function parseStringToDate(dateStr: string | null): Date | null {
    if (!dateStr) return null

    return DateTime.fromFormat(dateStr, "yyyy-MM-dd")
        .toJSDate()
}

/**
 * Преобразует объект Date в локальную строку 'yyyy-MM-dd HH:mm' без таймзоны
 * Выход: "2026-05-28 21:38"
 */
export function formatDateTimeToString(date: Date | null): string | null {
    if (!date) return null
    return DateTime.fromJSDate(date)
        .toFormat("yyyy-MM-dd HH:mm")
}

/**
 * Парсит строку 'yyyy-MM-dd HH:mm' обратно в локальный объект Date
 */
export function parseStringToDateTime(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null
    return DateTime.fromFormat(dateStr, "yyyy-MM-dd HH:mm")
        .toJSDate()
}

/**
 * Удаляет локальную таймзону, фиксируя видимые компоненты даты (год, месяц, день, часы...) строго в UTC.
 * Вход: Sun May 31 2026 14:20:00 GMT+0300
 * Выход: Sun May 31 2026 14:20:00 GMT+0000
 */
export function stripTimezone(date: Date | null): DateTime | null {
    if (!date) return null
    return DateTime.fromJSDate(date).toUTC(0, { keepLocalTime: true })
}

