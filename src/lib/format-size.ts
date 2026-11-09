export function formatBytes(bytes?: number, decimals = 1): string | null {
    if (bytes == null) return null
    if (bytes <= 0) return "0 Б"

    const k = 1024
    const units = ["Б", "КБ", "МБ", "ГБ", "ТБ", "ПБ"]
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        units.length - 1,
    )

    const value = bytes / Math.pow(k, i)
    const fixed = i === 0 ? 0 : decimals

    return `${value.toFixed(fixed)} ${units[i]}`
}
