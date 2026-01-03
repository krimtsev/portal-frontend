<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import logoSrc from "@a/images/logos/logo.png"
import BImage from "@c/common/b-image/b-image.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"

const isCollapsed = ref(false)
const sidebarVisible = ref(false)

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}
const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
}

const handleMenuClick = () => {
    // Приоритет overlay-режима на мобильных
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
        toggleSidebar()
    } else {
        toggleCollapse()
    }
}

const router = useRouter()
const navigate = (item) => {
    if (item.to) router.push(item.to)
    sidebarVisible.value = false // Скрываем оверлей на мобилках
}

const menuItems = [
    { label: "Главная", icon: "pi pi-home", to: "/dashboard" },
    { label: "Профиль", icon: "pi pi-user", to: "/profile" },
    { label: "Настройки", icon: "pi pi-cog", to: "/settings" }
]
</script>

<template>
    <div class="dashboard-layout">
        <div
            class="sidebar"
            :class="{
                collapsed: isCollapsed,
                visible: sidebarVisible
            }"
        >
            <div class="sidebar-header">
                <span class="logo">
                    <b-image
                        :src="logoSrc"
                        width="80px"
                    />
                </span>
                <b-button-icon
                    icon="pi pi-bars"
                    variant="text"
                    size="large"
                    class="close-btn"
                    rounded
                    @click="toggleSidebar"
                />
            </div>
            <ul class="menu">
                <li v-for="item in menuItems" :key="item.label">
                    <b-button
                        :label="item.label"
                        :icon="item.icon"
                        class="menu-item"
                        @click="navigate(item)"
                    />
                </li>
            </ul>
        </div>

        <div class="main-content">
            <div class="header">
                <b-button-icon
                    icon="pi pi-bars"
                    variant="text"
                    size="large"
                    class="menu-toggle"
                    rounded
                    @click="handleMenuClick"
                />
                <span class="header-title">Welcome</span>
            </div>
            <div class="content">
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
    overflow: hidden;
    position: relative;
}

/* Sidebar */
.sidebar {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
    width: 300px;
    transition: transform 0.3s ease;
    z-index: 1000;
    height: 100%;

    background-color: #2c3e50;
    //color: #ecf0f1;

    &-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
    }

}

/* Sidebar header */
.close-btn {
    color: #ecf0f1;
    display: none;
}

/* Menu */
.menu {
    list-style: none;
    padding: 0;
    margin: $indent-x4 0 0 0;
    flex-grow: 1;
}
.menu-item {
    width: 100%;
    justify-content: flex-start;
    padding: 0.75rem 1rem;
    color: #ecf0f1;
}
.menu-item:hover {
    background-color: #34495e;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    transition: all 0.3s ease;
}
.header {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 64px;
    border-bottom: 1px solid var(--p-content-border-color);
}
.menu-toggle {
    margin-right: 1rem;
    border-right: 1px solid var(--p-content-border-color);
}
.header-title {
    font-weight: bold;
    font-size: 1.2rem;
}
.content {
    padding: 1rem;
    overflow-y: auto;
    flex-grow: 1;
}

/* Collapsed (desktop only) */
@media (min-width: 769px) {
    .sidebar.collapsed {
        position: absolute;
        transform: translateX(-100%);
    }
    .sidebar.visible {
        /* Ignored */
    }
    .close-btn {
        display: none;
    }
}

/* Mobile overlay */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
    }
    .sidebar.visible {
        transform: translateX(0);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
    }
    .close-btn {
        display: inline-flex;
    }
    .sidebar.collapsed {
        /* On mobile, collapsed state doesn't matter */
        transform: translateX(-100%);
    }
}
</style>
