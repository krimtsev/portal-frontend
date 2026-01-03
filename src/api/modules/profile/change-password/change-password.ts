import { http } from "@/api"
import type { ChangePassword } from "@/api/modules/profile/change-password/definitions/change-password"

export async function change(data: ChangePassword) {
    return await http.put("profile/change-password", data)
}
