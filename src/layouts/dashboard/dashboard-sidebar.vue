<script setup lang="ts">
import { ref, computed, watch } from "vue"
import BImage from "@c/common/b-image/b-image.vue"
import { useRouter } from "vue-router"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { dashboardPaths } from "@r/dashboard/path"
import PrimePanelMenu from "primevue/panelmenu"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import type { MenuItem } from "primevue/menuitem"
import useAuthStore from "@s/auth/auth"

interface DashboardMenuItem extends MenuItem {
    activeNames?: string[]
    items?: DashboardMenuItem[]
    key: string;
    highlightOnExpand?: boolean
}

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const HIGHLIGHT_PARENT = false

const expandedKeys = ref<Record<string, boolean>>({})

const items = computed<DashboardMenuItem[]>(() => {
    const menu: DashboardMenuItem[] = [
        {
            key:  "home",
            label: t("mc.dashboard.sidebar.home"),
            icon:  "pi pi-home",
            route: dashboardPaths.DashboardPanel,
            activeNames: [
                DashboardRouteName.DashboardPanel
            ]
        }
    ]

    if (authStore.isSysAdmin) {
        menu.push({
            key:   "users",
            label: t("mc.dashboard.sidebar.users"),
            icon:  "pi pi-users",
            route: dashboardPaths.DashboardUsers,
            activeNames: [
                DashboardRouteName.DashboardUsers,
                DashboardRouteName.DashboardUser
            ]
        })

        menu.push({
            key:   "partners_root",
            label: t("mc.dashboard.sidebar.partners"),
            icon:  "pi pi-briefcase",
            activeNames: [
                DashboardRouteName.DashboardPartners,
                DashboardRouteName.DashboardPartner
            ],
            highlightOnExpand: false,
            items: [
                {
                    key:   "partner_list",
                    label: t("mc.dashboard.sidebar.partnerList"),
                    icon:  "pi pi-list",
                    route: dashboardPaths.DashboardPartners,
                    activeNames: [
                        DashboardRouteName.DashboardPartners,
                        DashboardRouteName.DashboardPartner
                    ],
                },
                {
                    key:   "partner_group",
                    label: t("mc.dashboard.sidebar.partnerGroups"),
                    icon:  "pi pi-th-large",
                    route: dashboardPaths.DashboardPartnerGroups,
                    activeNames: [
                        DashboardRouteName.DashboardPartnerGroups,
                        DashboardRouteName.DashboardPartnerGroup
                    ],
                }
            ]
        })
    }

    menu.push({
        key:  "tickets",
        label: t("mc.dashboard.sidebar.tickets"),
        icon:  "pi pi-comments",
        route: dashboardPaths.DashboardTickets,
        activeNames: [
            DashboardRouteName.DashboardTickets,
            DashboardRouteName.DashboardTicket
        ]
    })

    return menu
})

const goToHome = () => router.push({ name: DashboardRouteName.DashboardPanel })

const isActive = (item: any): boolean => {
    const currentName = route.name as string

    if (item.items?.length) {
        const hasActiveChild = item.items.some((child: any) =>
            child.activeNames?.includes(currentName)
        )

        if (HIGHLIGHT_PARENT) {
            const isExpanded = !!expandedKeys.value[item.key]
            return isExpanded || hasActiveChild
        }

        return hasActiveChild
    }

    return item.activeNames?.includes(currentName)
}

const autoExpand = () => {
    const newExpandedKeys: Record<string, boolean> = {}

    items.value.forEach(parent => {
        if (parent.items?.length) {
            const hasActiveChild = parent.items.some(child =>
                child.activeNames?.includes(route.name as string)
            );

            if (hasActiveChild) {
                newExpandedKeys[parent.key] = true
            }
        }
    })

    expandedKeys.value = newExpandedKeys
}

watch(
    () => route.name,
    () => autoExpand(),
    { immediate: true }
)
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
                <prime-panel-menu
                    :model="items"
                    v-model:expandedKeys="expandedKeys"
                >
                    <template #item="{ item }">
                        <router-link
                            v-if="item.route"
                            v-slot="{ href, navigate }"
                            v-ripple
                            :to="item.route"
                            custom
                        >
                            <a
                                :href="href"
                                class="sidebar-menu-item"
                                :class="{ 'active': isActive(item) }"
                                @click="navigate"
                            >
                                <span
                                    v-if="item.icon"
                                    class="mr-x2"
                                    :class="item.icon"
                                />
                                <span>
                                    {{ item.label }}
                                </span>
                            </a>
                        </router-link>

                        <a
                            v-if="item.items"
                            class="sidebar-menu-item"
                            :class="{ active: isActive(item) }"
                        >
                            <span
                                v-if="item.icon"
                                :class="item.icon"
                                class="mr-x2"
                            />
                            <span>{{ item.label }}</span>
                        </a>
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
    width: 18rem;
    height: 100%;
    transform: translateX(0);
    transition: transform .3s cubic-bezier(0, 0, .2, 1);
    z-index: 100;

    .sidebar-wrapper {
        position: relative;
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
            border-left: 8px solid transparent;

            &.active {
                background-color: var(--p-dashboard-card-background);
                border-left: 8px solid var(--p-primary-500);
            }
        }
    }

    :deep(.p-panelmenu) {
        gap: 0;

        .p-panelmenu-panel {
            border: none;
            background: none;
        }

        .p-panelmenu-submenu {
            .p-panelmenu-item {
                margin-top: calc($indent-x1 / 2);
            }
        }
    }
}
</style>
