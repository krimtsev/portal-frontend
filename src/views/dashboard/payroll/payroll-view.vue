<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import PrimeTab from "primevue/tab"
import PrimeTabList from "primevue/tablist"
import PrimeTabs from "primevue/tabs"
import { DashboardRouteName } from "@r/dashboard/route-names"

const route = useRoute()
const router = useRouter()

interface PageTab {
    id:   string
    text: string
}

const pagesTabs: PageTab[] = [
    {
        id:   DashboardRouteName.DashboardPayrollPartner,
        text: "Филиалы",
    },
    {
        id:   DashboardRouteName.DashboardPayrollStaff,
        text: "Сотрудники",
    },
]

const activeTab = computed({
    get() {
        return (route.name as string) || DashboardRouteName.DashboardPayrollPartner
    },
    set(name: string) {
        router.push({ name })
    },
})

const onTabChange = (val: string | number) => {
    activeTab.value = String(val)
}
</script>

<template>
    <div class="payroll-view">
        <div class="payroll-header mb-x2">
            <prime-tabs
                :value="activeTab"
                @update:value="onTabChange"
            >
                <prime-tab-list>
                    <prime-tab
                        v-for="tab in pagesTabs"
                        :key="tab.id"
                        :value="tab.id"
                    >
                        <span class="payroll-tab-item">
                            <span>{{ tab.text }}</span>
                        </span>
                    </prime-tab>
                </prime-tab-list>
            </prime-tabs>
        </div>

        <div class="payroll-content">
            <router-view />
        </div>
    </div>
</template>

<style scoped lang="scss">
.payroll-view {
    width: 100%;

    :deep(.p-tablist) {
        background: transparent;
    }

    .payroll-tab-item {
        display: inline-flex;
        align-items: center;
        gap: $indent-x1;
    }
}
</style>
