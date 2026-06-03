<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import PrimeTab from "primevue/tab"
import PrimeTabList from "primevue/tablist"
import PrimeTabs from "primevue/tabs"
import { DashboardRouteName } from "@r/dashboard/route-names"
import BSvg from "@c/common/b-svg/b-svg.vue"

const route = useRoute()
const router = useRouter()

interface PageTab {
    id:   string
    text: string
    icon: string
}

const pagesTabs: PageTab[] = [
    {
        id:   DashboardRouteName.DashboardPartners,
        text: "Спиок филиалов",
        icon: "pi pi-list",
    },
    {
        id:   DashboardRouteName.DashboardPartnerGroups,
        text: "Группы филиалов",
        icon: "pi pi-th-large",
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
                            <b-svg
                                v-if="tab.icon"
                                :name="tab.icon"
                                size="1.2rem"
                            />
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
