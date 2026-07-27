import { DateTime } from "luxon"
import {
    DB_DATE_FORMAT,
    DB_DATETIME_FORMAT,
    SHORT_DATETIME_FORMAT,
} from "@/constants/datetime"

/**
 * Статическая дата: 01-01-2026
 * Техническая данны начала сбора статистики
 */
export function getAnalyticsStartJSDate(): Date {
    return DateTime.fromISO("2026-01-01T00:00:00", { zone: "utc" })
        .toJSDate()
}

/**
 * Преобразовать строку yyyy-MM-dd HH:mm:ss в JS Date
 */
export function formatStringDateTimeToJSDate(
    date: string | null | undefined,
    isUTC: boolean = false,
): Date | null {
    if (!date) return null

    const zone = isUTC ? "utc" : undefined

    return DateTime.fromFormat(date, DB_DATETIME_FORMAT, { zone }).toJSDate()
}

/**
 * Преобразовать JS Date в строку yyyy-MM-dd HH:mm:ss
 */
export function formatJSDateToStringDateTime(
    date: Date | null | undefined,
    toUTC: boolean = false,
): string {
    if (!date) return ""

    let dt = DateTime.fromJSDate(date)

    if (toUTC) dt = dt.toUTC()

    return dt.toFormat(DB_DATETIME_FORMAT)
}

/**
 * Преобразовать строку yyyy-MM-dd в JS Date
 */
export function formatStringDateToJSDate(
    date: string | null | undefined,
    isUTC: boolean = false,
): Date | null {
    if (!date) return null

    const zone = isUTC ? "utc" : undefined

    return DateTime.fromFormat(date, DB_DATE_FORMAT, { zone }).toJSDate()
}

/**
 * Преобразовать JS Date в строку yyyy-MM-dd
 */
export function formatJSDateToStringDate(
    date: Date | null | undefined,
    toUTC: boolean = false,
): string {
    if (!date) return ""

    let dt = DateTime.fromJSDate(date)

    if (toUTC) dt = dt.toUTC()

    return dt.toFormat(DB_DATE_FORMAT)
}

/**
 * Преобразует JS Date в локальную строку yyyy-MM-dd
 */
export function formatJSDateToStartDateString(date: Date | null | undefined): string {
    if (!date) return ""

    return DateTime.fromJSDate(date)
        .startOf("month")
        .toFormat(DB_DATE_FORMAT)

}

// Текущий день (сегодня)
export function getTodayJSDate(): Date {
    return DateTime.utc()
        .toJSDate()
}

// Вчера (текущий день - 1 день)
export function getYesterdayJSDate(): Date {
    return DateTime.utc()
        .minus({ days: 1 })
        .toJSDate()
}

// Предыдущий месяц
export function getPreviousMonthJSDate(): Date {
    const baseDate = DateTime.utc().minus({ months: 1 })
    const startOfMinusMonth = baseDate.startOf("month")
    return startOfMinusMonth.toJSDate()
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
 * Форматирует серверную дату/время.
 * Если пришла строка с временем (yyyy-MM-dd HH:mm:ss), трактует её как UTC и переводит в Settings.defaultZone.
 */
export function formatStringToLocal(dateStr: string | null | undefined): string {
    if (!dateStr) return ""

    return DateTime.fromFormat(dateStr, "yyyy-MM-dd HH:mm:ss", { zone: "utc" })
        .setZone()
        .toFormat(SHORT_DATETIME_FORMAT)
}

// export function formatISOToDateTimeString(dateStr: string | null | undefined): string {
//     if (!dateStr) return ""
//
//     const dt = DateTime.fromISO(dateStr, { zone: "utc" })
//     if (!dt.isValid) return ""
//
//     return dt.toFormat(SHORT_DATETIME_FORMAT)
// }

// export function formatISOStringToJSDate(dateString: string | null | undefined): Date | null {
//     if (!dateString) return null
//
//     const dt = DateTime.fromISO(dateString)
//
//     return dt.isValid ? dt.toJSDate() : null
// }
//
// export function formatJSDateToISOString(date: Date | null | undefined): string {
//     if (!date) return ""
//
//     return DateTime.fromJSDate(date)
//         .toUTC()
//         .toFormat(DB_ISO_FORMAT)
// }

/**
 * Парсит полную серверную ISO-строку (например, "2026-07-09T00:00:00.000000Z")
 * в нативный объект JS Date.
 */
// export function parseServerIsoToDate(dateStr: string | null | undefined): Date | null {
//     if (!dateStr) return null
//
//     const dt = DateTime.fromISO(dateStr)
//     return dt.isValid ? dt.toJSDate() : null
// }

/**
 * Преобразует объект JS Date обратно в точный формат сервера
 * с сохранением микросекунд и таймзоны UTC ("yyyy-MM-ddT00:00:00.000000Z")
 */
// export function formatDateToServerIso(date: Date | null): string | null {
//     if (!date) return null
//
//     return DateTime.fromJSDate(date)
//         .startOf("day") // Сбрасываем время в 00:00:00, как это делает сервер для дат
//         .toFormat("yyyy-MM-dd'T'HH:mm:ss.000000'Z'") // Экранируем T и Z для строгого соответствия
// }

/**
 * Генерирует дефолтный период [Начало месяца, Вчера]
 * Если сегодня 1 число, вернет период за весь прошлый месяц
 */
// export function getMonthToYesterdayRange(): [Date, Date] {
//     const yesterday = DateTime.utc().minus({ days: 1 })
//     const startOfMonth = yesterday.startOf("month")
//
//     return [startOfMonth.toJSDate(), yesterday.toJSDate()]
// }
