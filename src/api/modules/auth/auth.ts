import { http } from "@/api"
import type {
    LoginCredentials,
    AuthData
} from "@/api/modules/auth/definitions/auth.ts"
// @ts-ignore
import env from "~/env.js"

export async function csrf() {
    return await http.get("sanctum/csrf-cookie", {
        baseURL: env.api,
        withCredentials: true,
        withXSRFToken: true,
    })
}

export async function login({ login, password, remember }: LoginCredentials) {
    return await http.post<AuthData>("login", {
        login,
        password,
        remember
    })
}

export async function logout() {
    return await http.post("logout")
}

export async function userData() {
    return await http.get<AuthData>("user-data")
}
