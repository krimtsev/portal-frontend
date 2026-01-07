<script setup lang="ts">
import { ref } from "vue"
import BImage from "@c/common/b-image/b-image.vue"
import { useRouter } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import PrimePanelMenu from "primevue/panelmenu"
import { useI18n } from "vue-i18n"
import { PortalRouteName } from "@r/portal/route-names"

const { t } = useI18n()
const router = useRouter()

const items = ref([
    {
        label: t("mc.dashboard.sidebar.home"),
        icon:  "pi pi-home",
        route: dashboardPaths.DashboardPanel,
    },
    {
        label: t("mc.dashboard.sidebar.tickets"),
        icon:  "pi pi-comments",
        route: dashboardPaths.DashboardTickets,
    },
])

const goToHome = () => router.push({ name: DashboardRouteName.DashboardPanel })
const goToPortal = () => router.push({ name: PortalRouteName.Home })
</script>

<template>
    <aside class="dashboard-sidebar">
        <div class="sidebar-wrapper">
            <div class="sidebar-header">
            <span class="logo">
                <b-image
                    src="logos/logo.png"
                    class="cursor-pointer"
                    @click="goToHome"
                />
            </span>
            </div>

            <div class="sidebar-menu">
                <prime-panel-menu :model="items">
                    <template #item="{ item }">
                        <router-link
                            v-if="item.route"
                            v-slot="{ href, navigate }"
                            v-ripple
                            :to="item.route"
                            custom
                        >
                            <a
                                class="sidebar-menu-item"
                                :href="href"
                                @click="navigate"
                            >
                                <span :class="item.icon" />
                                <span class="ml-x2">{{ item.label }}</span>
                            </a>
                        </router-link>
                    </template>
                </prime-panel-menu>
            </div>
        </div>
    </aside>
</template>

<style scoped lang="scss">
.dashboard-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 20rem;
    height: 100%;
    border-right: 1px solid var(--p-surface-700);
    transform: translateX(0);
    transition: transform .3s cubic-bezier(0, 0, .2, 1);
    z-index: 100;
    background: #181819;

    .sidebar-wrapper {
        padding: 0 1.5rem;
        height: 100%;
    }

    .sidebar-header {
        padding: 2rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sidebar-menu {
        .sidebar-menu-item {
            display: flex;
            align-items: center;
            position: relative;
            outline: 0 none;
            cursor: pointer;
            padding: 8px 16px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 8px;
        }
    }

    :deep(.p-panelmenu) {
        gap: 0;

        .p-panelmenu-panel {
            border: none;
            background: none;
        }
    }
}
</style>
