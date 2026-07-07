export function getUnlocalizedFileName(path: string) {
    const filePath = path.split("?")[0]
    const localizedFileName = filePath.split("/").pop() || ""
    return localizedFileName.replace(/\{.+}(\..+)$/, "$1")
}

export function valueOrDash(val?: string | number | null): string {
    if (val === 0) return "0"
    if (!val) return "—"
    return String(val)
}

export function generatePassword(length: number = 10): string {
    const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*"
    let password = ""

    const values = new Uint32Array(length)
    window.crypto.getRandomValues(values)

    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length]
    }

    return password
}

export function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatPrice(price: number, digits = 2) {
    const pow = Math.pow(10, digits)
    const truncatedPrice = Math.trunc(price * pow) / pow

    return new Intl.NumberFormat("ru-RU", {
        style:                 "decimal",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(truncatedPrice)
}

export function formatNumber(value: number) {
    return formatPrice(value, 0)
}

export function toString(value: number | string) {
    return value.toString()
}
