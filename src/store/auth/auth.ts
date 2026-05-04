import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import { getCookie } from "@/lib/cookie"

import { HttpError } from "@/api"
import * as authAPI from "@/api/modules/auth/auth"
import type {
    LoginCredentials,
    UserAccessData,
    UserData,
} from "@/api/modules/auth/definitions/auth"
import router from "@/router"
import { CommonRouteName } from "@/router/common/route-names"
import { Roles } from "@/shared/roles/roles"

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

function defaultUserAccessData(): UserAccessData {
    return {
        location_map: false,
    }
}

export const useAuthStore = defineStore("auth", () => {
    let user = reactive<UserData>(defaultUserData())
    let userAccess = reactive<UserAccessData>(defaultUserAccessData())
    const isAuthenticated = ref(false)
    const isLoading = ref(true)

    const isSysAdmin = computed(() => user.role === Roles.SYSADMIN)

    async function csrf() {
        await authAPI.csrf()
    }

    async function auth() {
        setLoading(true)

        try {
            if (!getCookie("XSRF-TOKEN")) {
                return false
            }

            return await initUserData()
        } catch (error) {
            console.error(error)
            return false
        } finally {
            setLoading(false)
        }
    }

    async function login(credentials: LoginCredentials) {
        setLoading(true)

        await csrf()
        const authData = await authAPI.login(credentials)

        if (authData instanceof HttpError) {
            await reset(false)
            return authData
        }

        Object.assign(user, authData.user)
        Object.assign(userAccess, authData.access)

        isAuthenticated.value = true
        setLoading(false)
    }

    async function logout() {
        const res = await authAPI.logout()

        if (res instanceof HttpError) {
            return res
        }

        await reset(true)
    }

    async function initUserData(): Promise<boolean> {
        const userData = await authAPI.userData()

        if (userData instanceof HttpError) {
            await reset(false)
            return false
        }

        Object.assign(user, userData.user)
        Object.assign(userAccess, userData.access)
        isAuthenticated.value = true

        return true
    }

    async function reset(redirect: boolean) {
        user = defaultUserData()
        userAccess = defaultUserAccessData()

        isAuthenticated.value = false
        setLoading(false)

        if (redirect) {
            await router.push({ name: CommonRouteName.Auth })
        }
    }

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    return {
        user:       computed(() => user),
        userAccess: computed(() => userAccess),
        isAuthenticated,
        isLoading,
        isSysAdmin,

        auth,
        initUserData,
        csrf,
        login,
        logout,
        reset,
        setLoading,
    }
})
