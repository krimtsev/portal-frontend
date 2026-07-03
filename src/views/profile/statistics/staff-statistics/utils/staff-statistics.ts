export function clearName(text: string) {
    return text.replace(/\s*\(.*\)/g, "")
}

export function clearSpecialization(text: string) {
    return text.replace(/\s*\[.*]/g, "")
}
