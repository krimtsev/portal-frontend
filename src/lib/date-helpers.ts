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

export function formatJSDateToStartDate(value: Date | null | undefined): string | null {
    if (!value) return null

    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}-01`
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

/**
 * Парсит полную серверную ISO-строку (например, "2026-07-09T00:00:00.000000Z")
 * в нативный объект JS Date.
 */
export function parseServerIsoToDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null

    const dt = DateTime.fromISO(dateStr)
    return dt.isValid ? dt.toJSDate() : null
}

/**
 * Преобразует объект JS Date обратно в точный формат сервера
 * с сохранением микросекунд и таймзоны UTC ("yyyy-MM-ddT00:00:00.000000Z")
 */
export function formatDateToServerIso(date: Date | null): string | null {
    if (!date) return null

    return DateTime.fromJSDate(date)
        .startOf("day") // Сбрасываем время в 00:00:00, как это делает сервер для дат
        .toFormat("yyyy-MM-dd'T'HH:mm:ss.000000'Z'") // Экранируем T и Z для строгого соответствия
}

/**
 * Форматирует серверную дату/время.
 * Если пришла строка с временем (yyyy-MM-dd HH:mm:ss), трактует её как UTC и переводит в Settings.defaultZone.
 */
export function formatStringToLocal(
    dateStr: string | null | undefined,
    outputFormat: string = "yyyy-MM-dd HH:mm",
): string | null {
    if (!dateStr) return null

    return DateTime.fromFormat(dateStr, "yyyy-MM-dd HH:mm:ss", { zone: "utc" })
        .setZone()
        .toFormat(outputFormat)
}
