<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import PrimeTab from "primevue/tab"
import PrimeTabList from "primevue/tablist"
import PrimeTabs from "primevue/tabs"
import { useAppStore } from "@s/app/app.ts"
import { DashboardRouteName } from "@r/dashboard/route-names"

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

interface PageTab {
    id:   string
    text: string
}

const pagesTabs: PageTab[] = [
    {
        id:   DashboardRouteName.DashboardRoyaltyPercent,
        text: "Роялти проценты",
    },
    {
        id:   DashboardRouteName.DashboardRoyaltyRecords,
        text: "Роялти записи",
    },
]

const activeTab = computed({
    get() {
        return (route.name as string) || DashboardRouteName.DashboardPartners
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
    <div class="partners-view">
        <div
            v-if="appStore.isBritva"
            class="partners-header mb-x2"
        >
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
                        <span class="partners-tab-item">
                            <span>{{ tab.text }}</span>
                        </span>
                    </prime-tab>
                </prime-tab-list>
            </prime-tabs>
        </div>

        <div class="partners-content">
            <router-view />
        </div>
    </div>
</template>

<style scoped lang="scss">
.partners-view {
    width: 100%;

    :deep(.p-tablist) {
        background: transparent;
    }

    .partners-tab-item {
        display: inline-flex;
        align-items: center;
        gap: $indent-x1;
    }
}
</style>
