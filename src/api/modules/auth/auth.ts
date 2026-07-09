import { http } from "@/api"
import type {
    AuthResponse,
    LoginCredentials,
} from "@/api/modules/auth/definitions/auth"
import partnerContext from "virtual:partner"

export async function csrf() {
    return await http.get("sanctum/csrf-cookie", {
        baseURL:         partnerContext.api,
        withCredentials: true,
        withXSRFToken:   true,
    })
}

export async function login({ login, password, remember }: LoginCredentials) {
    return await http.post<{ data: AuthResponse }>("login", {
        login,
        password,
        remember,
    })
}

export async function logout() {
    return await http.post("logout")
}

export async function userData() {
    return await http.get<{ data: AuthResponse }>("user-data", { skipAuthGuard: true })
}
