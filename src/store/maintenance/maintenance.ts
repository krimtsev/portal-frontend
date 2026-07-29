import { defineStore } from "pinia"
import { computed, ref } from "vue"
import router from "@/router"
import { CommonRouteName } from "@/router/common/route-names"
import type { MaintenanceData } from "@v/dashboard/settings/maintenance/definitions/maintenance"
import { useAuthStore } from "@s/auth/auth"
import { Roles } from "@/definitions/roles"


export const useMaintenanceStore = defineStore("maintenance", () => {
    const authStore = useAuthStore()

    const isMaintenance = ref(false)

    function setMaintenanceData(data: MaintenanceData) {
        isMaintenance.value = data.enabled
    }

    const isAllowedAccess = computed(() => {
        if (!isMaintenance.value) return true

        return authStore.user?.role === Roles.SYSADMIN
    })

    const showNotice = computed(() => {
        return isMaintenance.value && authStore.user.role === Roles.SYSADMIN
    })

    async function enableMaintenance() {
        isMaintenance.value = true

        if (!isAllowedAccess.value) {
            await router.push({ name: CommonRouteName.Maintenance })
        }
    }

    return {
        isMaintenance,
        showNotice,
        isAllowedAccess,

        setMaintenanceData,
        enableMaintenance,
    }
})
