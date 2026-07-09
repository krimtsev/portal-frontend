import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { getCookie } from "@/lib/cookie"
import { HttpError } from "@/api"
import * as authAPI from "@/api/modules/auth/auth"
import type {
    AuthData,
    AuthResponse,
    LoginCredentials,
    PartnerData,
    UserAccessData,
    UserData,
} from "@/api/modules/auth/definitions/auth"
import router from "@/router"
import { CommonRouteName } from "@/router/common/route-names"
import { Roles } from "@/definitions/roles"
import { isSupportedTimezone } from "@/lib/timezones.ts"
import { Settings } from "luxon"


function defaultAuthData(): AuthData {
    return {
        user: {
            login:  "",
            role:   Roles.UNAUTHORIZED,
            name:   "",
            avatar: "",
            email:  "",
        },
        partner:      null,
        timeZoneName: "",
    }
}

function defaultUserAccessData(): UserAccessData {
    return {
        location_map: false,
    }
}

export const useAuthStore = defineStore("auth", () => {
    const initialData = defaultAuthData()

    const user = ref<UserData>(initialData.user)
    const partner = ref<PartnerData | null>(initialData.partner)
    const timeZoneName = ref<string>(initialData.timeZoneName)
    const userAccess = ref<UserAccessData>(defaultUserAccessData())

    const isAuthenticated = ref(false)
    const isLoading = ref(true)

    const isSysAdmin = computed(() => user.value.role === Roles.SYSADMIN)

    async function csrf() {
        await authAPI.csrf()
    }

    function setAuthData(response: AuthResponse) {
        user.value = response.user
        userAccess.value = response.access
        partner.value = response.partner
        timeZoneName.value = response.timeZoneName

        setDefaultZoneName(timeZoneName.value)
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
        const response = await authAPI.login(credentials)

        if (response instanceof HttpError) {
            await reset(false)
            return response
        }

        setAuthData(response.data)

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
        const response = await authAPI.userData()

        if (response instanceof HttpError) {
            await reset(false)
            return false
        }

        setAuthData(response.data)
        isAuthenticated.value = true

        return true
    }

    async function reset(redirect: boolean) {
        const defaultData = defaultAuthData()

        user.value = defaultData.user
        partner.value = defaultData.partner
        timeZoneName.value = defaultData.timeZoneName
        userAccess.value = defaultUserAccessData()

        isAuthenticated.value = false
        setLoading(false)

        if (redirect) {
            await router.push({ name: CommonRouteName.Auth })
        }
    }

    function setDefaultZoneName(timeZoneName: string) {
        if (!isSupportedTimezone(timeZoneName)) {
            timeZoneName = "Europe/Moscow"
        }
        Settings.defaultZone = timeZoneName
    }

    function setTimeZone(value: string) {
        setDefaultZoneName(value)

        timeZoneName.value = value
    }

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    return {
        user,
        partner,
        timeZoneName,

        userAccess,
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
        setTimeZone,
    }
})
