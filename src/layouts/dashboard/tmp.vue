<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import Button from "primevue/button"
import { useRouter } from "vue-router"

const isCollapsed = ref(false)
const sidebarVisible = ref(false)
const isMobile = ref(false)

const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768
    if (isMobile.value) {
        isCollapsed.value = false
    }
}

onMounted(() => {
    updateIsMobile()
    window.addEventListener("resize", updateIsMobile)
})
onBeforeUnmount(() => {
    window.removeEventListener("resize", updateIsMobile)
})

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}
const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
}

const router = useRouter()
const navigate = (item) => {
    if (item.to) router.push(item.to)
    if (isMobile.value) sidebarVisible.value = false
}

const menuItems = [
    { label: "Главная", icon: "pi pi-home", to: "/dashboard" },
    { label: "Профиль", icon: "pi pi-user", to: "/profile" },
    { label: "Настройки", icon: "pi pi-cog", to: "/settings" }
]
</script>

<template>
    <div class="app-layout">
        <!-- Sidebar -->
        <div
            class="sidebar"
            :class="{
                collapsed: isCollapsed && !isMobile,
                mobile: isMobile,
                visible: sidebarVisible && isMobile
            }"
        >
            <div class="sidebar-header">
                <span class="logo">My App</span>
                <Button
                    v-if="isMobile"
                    icon="pi pi-times"
                    class="close-btn"
                    text
                    @click="toggleSidebar"
                />
            </div>
            <ul class="menu">
                <li v-for="item in menuItems" :key="item.label">
                    <Button
                        :label="item.label"
                        :icon="item.icon"
                        class="menu-item"
                        text
                        @click="navigate(item)"
                    />
                </li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="header">
                <Button
                    icon="pi pi-bars"
                    class="menu-toggle"
                    text
                    @click="isMobile ? toggleSidebar() : toggleCollapse()"
                />
                <span class="header-title">Welcome</span>
            </div>
            <div class="content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped>
.app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

/* Sidebar styles */
.sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: #ecf0f1;
    transition: transform 0.3s ease;
    z-index: 1000;
    height: 100%;
    position: relative;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}

/* Collapsed on desktop */
.sidebar.collapsed {
    position: absolute;
    transform: translateX(-100%);
}

/* Mobile overlay */
.sidebar.mobile {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
}
.sidebar.mobile.visible {
    transform: translateX(0);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
}

/* Sidebar header */
.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-weight: bold;
    font-size: 1.2rem;
}
.close-btn {
    color: #ecf0f1;
}

/* Menu */
.menu {
    list-style: none;
    padding: 0;
    margin: 0;
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

/* When sidebar is collapsed, content takes full width */
.main-content.expanded {
    margin-left: 0;
}

/* Header */
.header {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.menu-toggle {
    margin-right: 1rem;
}
.header-title {
    font-weight: bold;
    font-size: 1.2rem;
}

/* Content */
.content {
    padding: 1rem;
    overflow-y: auto;
    flex-grow: 1;
}
</style>
