<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import PrimeTab from "primevue/tab"
import PrimeTabList from "primevue/tablist"
import PrimeTabs from "primevue/tabs"
import { useAuthStore } from "@s/auth/auth"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { DashboardSection } from "@/definitions/dashboard"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

interface PageTab {
    id:      string
    text:    string
    section: DashboardSection
}

const allTabs: PageTab[] = [
    {
        id:      DashboardRouteName.DashboardPartners,
        text:    "Спиок филиалов",
        section: DashboardSection.Partners,
    },
    {
        id:      DashboardRouteName.DashboardPartnerGroups,
        text:    "Группы филиалов",
        section: DashboardSection.PartnerGroups,
    },
    {
        id:      DashboardRouteName.DashboardPartnerNotifications,
        text:    "Настройка уведомлений",
        section: DashboardSection.PartnerNotifications,
    },
]

const pagesTabs = computed(() =>
    allTabs.filter(tab => authStore.canSee(tab.section)),
)

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
        <div class="partners-header mb-x2">
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
