import { http } from "@/api"

export async function read(id: number) {
    return await http.post<null>(`promo-dialog/dialog/${id}/read`)
}

export async function getImage(id: number) {
    return await http.getFile({
        url:      `promo-dialog/dialog/${id}`,
        fileName: "image",
    })
}
