import { computed, reactive, ref } from "vue"
import { defineStore } from "pinia"
import type {
    UserData,
    LoginCredentials,
} from "@/api/modules/auth/definitions/auth"
import * as authAPI from "@/api/modules/auth/auth"
import { HttpError } from "@/api"
import { Roles } from "@/shared/roles/roles"
import router from "@r/router.ts"
import { CommonRouteName } from "@/router/common/route-names"
import { PortalRouteName } from "@/router/portal/route-names"
import { getCookie } from "@/lib/utils"

function defaultUserData(): UserData {
    return {
        login:   "",
        role:    Roles.UNAUTHORIZED,
        name:    "",
        avatar:  "",
        email:   "",
        partner: null,
    }
}

const useAuthStore = defineStore("auth", () => {
    let user = reactive<UserData>(defaultUserData())
    const isAuthenticated = ref(false)
    const isLoading = ref(true)
    const isSysAdmin = computed(() => user.role === Roles.SYSADMIN)

    async function csrf() {
        await authAPI.csrf()
    }

    async function auth() {
        if (!getCookie("XSRF-TOKEN")) {
            isLoading.value = false
            return false
        }

        await csrf()
        const result = await getUserData()
        isLoading.value = false
        return result
    }

    async function login(credentials: LoginCredentials) {
        await csrf()
        const authData = await authAPI.login(credentials)

        if (authData instanceof HttpError) {
            await reset(false)
            return authData
        }

        Object.assign(user, authData.user)
        isAuthenticated.value = true
        isLoading.value = false

        await router.push({ name: PortalRouteName.Home })
    }

    async function logout() {
        const res = await authAPI.logout()

        if (res instanceof HttpError) {
            return res
        }

        await reset(true)
    }

    async function getUserData(): Promise<boolean> {
        const userData = await authAPI.userData()

        if (userData instanceof HttpError) {
            await reset(false)
            return false
        }

        Object.assign(user, userData.user)
        isAuthenticated.value = true
        isLoading.value = false

        return true
    }

    async function reset(redirect: boolean) {
        user = defaultUserData()
        isAuthenticated.value = false
        isLoading.value = false

        if (redirect) {
            await router.push({ name: CommonRouteName.Auth })
        }
    }

    return {
        user: computed(() => user),
        isAuthenticated,
        isLoading,
        isSysAdmin,
        auth,
        getUserData,
        csrf,
        login,
        logout,
        reset,
    }
})

export default useAuthStore
