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
