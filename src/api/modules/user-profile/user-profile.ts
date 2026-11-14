import { http } from "@/api"
import type { UserProfile } from "@/api/modules/user-profile/definitions/user-profile"

export async function getUserProfile() {
    return await http.get<UserProfile>("user-profile")
}

export async function updateUserProfile() {
    return await http.put<null>("user-profile")
}
