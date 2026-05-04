import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { Partner } from "@/shared/partner/partner"
import env from "~/env"
import { Roles } from "@/shared/roles/roles"
import { useAuthStore } from "@s/auth/auth"

export const useAppStore = defineStore("app", () => {
    const authStore = useAuthStore()

    const isLoading = ref(true)
    const isDisabled = ref(false)
    const isRoutesLoaded = ref(false)

    const currentPartner = env.app.partner

    const isBritva = computed(() => currentPartner === Partner.Britva)
    const isSoda = computed(() => currentPartner === Partner.Soda)

    const hasDashboard = computed(() => [Roles.SYSADMIN, Roles.ADMIN].includes(authStore.user?.role))
    const showLocationMap = computed(() => authStore.userAccess.location_map)

    function setLoading(value: boolean) {
        isLoading.value = value
    }

    function setDisabled(value: boolean) {
        isDisabled.value = value
    }

    function setRoutesLoaded(value: boolean) {
        isRoutesLoaded.value = value
    }

    return {
        isLoading,
        isDisabled,
        isRoutesLoaded,
        isBritva,
        isSoda,
        hasDashboard,
        showLocationMap,

        setLoading,
        setDisabled,
        setRoutesLoaded,
    }
})
