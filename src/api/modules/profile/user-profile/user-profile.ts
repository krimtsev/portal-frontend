import { http } from "@/api"
import type { UserProfile } from "@/api/modules/profile/user-profile/definitions/user-profile"

export async function getUserProfile() {
    return await http.get<UserProfile>("profile/user-profile")
}

export async function updateUserProfile() {
    return await http.put<null>("profile/user-profile")
}
