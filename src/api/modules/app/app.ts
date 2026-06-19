import { http } from "@/api"
import type { PortalHome } from "@/api/modules/app/definitions/app"

export async function home() {
    return await http.get<PortalHome>("home")
}
