export function getPublicLink(url: string) {
    const cleanedUrl = url.startsWith("/") ? url.slice(1) : url
    return `/partner/${cleanedUrl}`
}

export function openExternalLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
}
