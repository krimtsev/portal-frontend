<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue"
import { RouterView, useRoute } from "vue-router"
import PrimeToast from "primevue/toast"
import { useAppStore } from "@s/app/app"
import { CommonRouteName } from "@r/common/route-names"
import { dashboardPaths } from "@r/dashboard/path"


const DashboardLayout = defineAsyncComponent(() => import("@l/dashboard/DashboardLayout.vue"))
const PortalLayout = defineAsyncComponent(() => import("@l/portal/PortalLayout.vue"))
const GuestLayout = defineAsyncComponent(() => import("@l/guest/GuestLayout.vue"))

const route = useRoute()
const appStore = useAppStore()

const layout = computed(() => {
    if (route.meta.layout) {
        return route.meta.layout
    }

    if (!appStore.isRoutesLoaded || route.name === CommonRouteName.Auth) {
        return GuestLayout
    }

    if (route.path.startsWith(dashboardPaths.Dashboard)) {
        return DashboardLayout
    }

    return PortalLayout
})
</script>

<template>
    <prime-toast position="top-center" />
    <component :is="layout">
        <router-view v-slot="{ Component, route: viewRoute }">
            <transition name="layout-fade" mode="out-in">
                <component :is="Component" :key="viewRoute.fullPath" />
            </transition>
        </router-view>
    </component>
</template>

<style lang="scss">
.layout-fade-enter-active,
.layout-fade-leave-active {
    transition: opacity 0.25s ease;
}

.layout-fade-enter-from,
.layout-fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
