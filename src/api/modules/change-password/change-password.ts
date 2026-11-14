import { http } from "@/api"
import type { ChangePassword } from "@/api/modules/change-password/definitions/change-password"

export async function change(data: ChangePassword) {
    return await http.put("change-password", data)
}
