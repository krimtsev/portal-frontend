<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import DashboardSidebar from "@l/dashboard/DashboardSidebar.vue"
import PrimeButton from "primevue/button"
import PrimeAvatar from "primevue/avatar"
import PrimeMenu from "primevue/menu"
import useAuthStore from "@s/auth/auth"
import { useRouter } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"
import { PortalRouteName } from "@r/portal/route-names"
import { useI18n } from "vue-i18n"
import { useDashboardStyle } from "@/composables/dashboard-style/use-dashboard-style"
import Breadcrumbs from "@l/dashboard/components/breadcrumbs.vue"

useDashboardStyle()

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const isMobile = ref(window.innerWidth <= 991)
const sidebarActive = ref(!isMobile.value)
let desktopSidebarActive = true

const sidebarRef = ref<any>(null)

const avatarLabel = computed(() => {
    const login = authStore.user.login
    return login[0].toUpperCase()
})
const updateViewport = () => {
    const mobile = window.innerWidth <= 991

    if (mobile !== isMobile.value) {
        if (mobile) {
            sidebarActive.value = false
        } else {
            sidebarActive.value = desktopSidebarActive
        }
    }

    isMobile.value = mobile
}

const handleMenuClick = () => {
    sidebarActive.value = !sidebarActive.value
    if (!isMobile.value) {
        desktopSidebarActive = sidebarActive.value
    }
}

const handleOutsideClick = (event: MouseEvent) => {
    if (!isMobile.value || !sidebarActive.value) return

    const target = event.target as Node
    const sidebarComponent = sidebarRef.value

    const sidebarEl = sidebarComponent?.$el || sidebarComponent
    if (!sidebarEl) return

    if (!sidebarEl.contains(target)) {
        sidebarActive.value = false
    }
}

onMounted(() => {
    window.addEventListener("resize", updateViewport)
    document.addEventListener("click", handleOutsideClick)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateViewport)
    document.removeEventListener("click", handleOutsideClick)
})

const menuRef  = ref<any>(null)
const profileItems = ref([
    {
        label: t("mc.common.profile"),
        icon:  "pi pi-user",
        command: () => {
            router.push({ name: ProfileRouteName.Profile })
        }
    },
    {
        label: t("mc.common.portal"),
        icon:  "pi pi-reply",
        command: () => {
            router.push({ name: PortalRouteName.Home })
        }
    },
    {
        label: t("mc.common.exit"),
        icon:  "pi pi-sign-out",
        command: async () => {
            await authStore.logout()
        }
    },
])
const toggleMenu = (event: PointerEvent) => {
    menuRef.value.toggle(event)
}
</script>

<template>
    <div
        class="dashboard-layout"
        :class="{
            'layout-desktop-inactive': !isMobile && !sidebarActive,
            'layout-mobile-active': isMobile && sidebarActive
        }"
    >
        <dashboard-sidebar ref="sidebarRef" />

        <div class="layout-wrapper">
            <div class="layout-topbar" >
                <div class="topbar-start">
                    <prime-button
                        icon="pi pi-bars"
                        size="large"
                        variant="text"
                        @click.stop="handleMenuClick"
                    />

                    <div class="topbar-title">
                        <breadcrumbs />
                    </div>
                </div>

                <div class="topbar-end">
                    <prime-avatar
                        :label="avatarLabel"
                        class="mr-2 cursor-pointer"
                        @click="toggleMenu"
                    />
                    <prime-menu
                        ref="menuRef"
                        :model="profileItems"
                        :popup="true"
                    >
                        <template #item="{ item, props }">
                            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                                    <span :class="item.icon" />
                                    <span class="ml-2">{{ item.label }}</span>
                                </a>
                            </router-link>
                            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                                <span :class="item.icon" />
                                <span class="ml-2">{{ item.label }}</span>
                            </a>
                        </template>
                    </prime-menu>
                </div>
            </div>

            <div class="layout-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    position: relative;

    overflow-x: auto; // fix mobile

    :deep(.p-button-icon-only) {
        width: var(--p-avatar-width);
        height: var(--p-avatar-height);
        border-radius: var(--p-avatar-border-radius);
    }
}

/* ===== DESKTOP ===== */
@media (min-width: 992px) {
    .layout-wrapper {
        margin-left: 19rem;
        transition: margin-left .3s cubic-bezier(0,0,.2,1);
    }

    .layout-desktop-inactive {
        .layout-wrapper {
            margin-left: 0;
        }

        .dashboard-sidebar {
            transform: translateX(-100%);
        }
    }
}

/* ===== MOBILE ===== */
@media (max-width: 991px) {
    .layout-wrapper {
        margin-left: 0;
        padding: 1rem;
    }

    .dashboard-sidebar {
        transform: translateX(-100%);
        z-index: 999;
    }

    .layout-mobile-active {
        .dashboard-sidebar {
            transform: translateX(0);
            box-shadow: 2px 0 10px rgba(0,0,0,.3);
            background: var(--p-surface-900);
        }
    }
}

/* ===== ULTRA-WIDE ===== */
@media (min-width: 1960px) {
    .layout-content,
    .layout-topbar {
        width: 1504px;
        margin-left: auto !important;
        margin-right: auto !important;
    }
}

.layout-wrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 2rem;
}

.layout-topbar {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .topbar-start {
        display: flex;
        align-items: center;
        position: relative;
        gap: 1.5rem;
    }
}
</style>
