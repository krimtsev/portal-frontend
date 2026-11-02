import { http } from "@/api"

export async function read(id: number) {
    return await http.post<null>(`promo-dialog/${id}/read`)
}
