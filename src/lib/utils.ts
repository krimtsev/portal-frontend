export function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) {
        return match[2]
    }
    return null
}

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
