<script setup lang="ts">
import { ref } from "vue"
import BImage from "@c/common/b-image/b-image.vue"
import { useRouter } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import PrimePanelMenu from "primevue/panelmenu"

defineProps<{
    collapsed: boolean
    mobile: boolean
}>()

const router = useRouter()

const items = ref([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        route: dashboardPaths.DashboardPanel,
    },
    {
        label: 'Заявки',
        icon: 'pi pi-comments',
        route: dashboardPaths.DashboardTickets,
    },
])

const goToHome = () => router.push({ name: DashboardRouteName.DashboardPanel })
</script>

<template>
    <aside
        class="dashboard-sidebar"
        :class="{ collapsed, mobile }"
    >
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
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
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
    </aside>
</template>

<style scoped lang="scss">
.dashboard-sidebar {
    width: 280px;
    //background: #2c3e50;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: width .2s ease, transform .3s ease;

    .sidebar-header {
        padding: 2rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sidebar-menu {
        padding: 0 1.5rem;

        .sidebar-menu-item {
            display: flex;
            align-items: center;
            position: relative;
            outline: 0 none;
            cursor: pointer;
            padding: .5rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 8px;
        }
    }
}
</style>
