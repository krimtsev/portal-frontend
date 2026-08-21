import { http } from "@/api"
import partnerContext from "virtual:partner"

export async function downloadPartnerFile(category: string, fileName: string) {
    return await http.getFile({
        url: `files/download/${category}`,
        fileName,
    })
}

export async function getPartnerFileRender(category: string, fileName: string) {
    return await http.getFile({
        url: `files/render/${category}`,
        fileName,
    })
}

export function getStorageLink(category: string, fileName: string): string {
    const baseUrl = partnerContext.api || ""
    const prefix = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl

    return `${prefix}/api/media/${category}/${fileName}`
}
