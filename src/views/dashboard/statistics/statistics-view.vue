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
        id:   DashboardRouteName.DashboardStatisticsStaff,
        text: "Статистика по сотрудникам",
    },
    {
        id:   DashboardRouteName.DashboardStatisticsPartner,
        text: "Статистика по филиалам",
    },
]

const activeTab = computed({
    get() {
        return (route.name as string) || DashboardRouteName.DashboardStatisticsStaff
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
    <div class="statistics-view">
        <div class="statistics-header mb-x2">
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
                        <span class="statistics-tab-item">
                            <span>{{ tab.text }}</span>
                        </span>
                    </prime-tab>
                </prime-tab-list>
            </prime-tabs>
        </div>

        <div class="statistics-content">
            <router-view />
        </div>
    </div>
</template>

<style scoped lang="scss">
.statistics-view {
    width: 100%;

    :deep(.p-tablist) {
        background: transparent;
    }

    .statistics-tab-item {
        display: inline-flex;
        align-items: center;
        gap: $indent-x1;
    }
}
</style>
