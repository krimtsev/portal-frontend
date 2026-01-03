<script setup lang="ts">
import PrimeMenubar from "primevue/menubar"
import BImage from "@c/common/b-image/b-image.vue"
import BLink from "@c/common/b-link/b-link.vue"
import { useRouter } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { ProfileRouteName } from "@r/profile/route-names"
import useAuthStore from "@s/auth/auth"
// import BAvatar from "@c/common/b-avatar/b-avatar.vue"
import { menuData } from "@l/portal/data/menu"

const router = useRouter()
const authStore = useAuthStore()
const menuItems = menuData()

function goToHome() {
    router.push({ name: PortalRouteName.Home })
}

function goToProfile() {
    router.push({ name: ProfileRouteName.Profile })
}

async function onLogout() {
    await authStore.logout()
}
</script>

<template>
    <div class="portal-layout">
        <div class="wrapper">
            <prime-menubar
                :model="menuItems"
                breakpoint="1336px"
            >
                <template #start>
                    <b-image
                        src="logos/logo.png"
                        class="cursor-pointer"
                        @click="goToHome"
                    />
                </template>
                <template #end>
                    <div class="right-section">
                        <div class="right-section-item">
<!--                            <b-avatar-->
<!--                                class="pointer"-->
<!--                                @click="goToProfile"-->
<!--                            />-->

                            <b-link
                                label="Профиль"
                                as-internal
                                @click="goToProfile"
                            />
                        </div>
                        <div class="right-section-item">
                            <b-link
                                label="Выйти"
                                @click="onLogout"
                            />
                        </div>
                    </div>
                </template>
            </prime-menubar>

            <div class="p-4">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style>
body {
    font-family: "Akzidenz-Grotesk Pro", sans-serif;
}
</style>

<style scoped lang="scss">
.portal-layout {
    width: 100%;
    overflow: hidden; // обрезаем glow

    .wrapper {
        margin: 0 auto;
        max-width: $layout-max-width;
        padding: $indent-x4 $indent-x1 $indent-x1;
    }

    .right-section {
        display: flex;
        align-items: center;

        &-item {
            display: flex;
            align-items: center;
            gap: $indent-x2;

            &:not(:last-child)::after {
                content: "|";
                margin-right: $indent-x2;
            }
        }
    }

    :deep(.p-menubar) {
        position: relative;
        background: transparent;
        border: none;
        border-radius: 0;
        margin-bottom: 64px;
        z-index: 3;

        .p-menubar-start {
            margin-right: 64px;
        }

        .p-menubar-root-list {
            gap: $indent-x1;
        }

        .p-menubar-item {
            border: 1px solid #2B2B2B;
            border-radius: $indent-x4;
            overflow: hidden;

            .p-menubar-item-content {
                .p-menubar-item-link {
                    padding: calc($indent-x2 - 2px)  $indent-x2;
                }
            }

            &.right-icon .p-menubar-item-link {
                display: flex;
                flex-direction: row-reverse;
                justify-content: space-between;
                align-items: center;
            }
        }

        .p-menubar-submenu {
            .p-menubar-item {
                border: none;
                border-radius: $indent-x1;
            }
        }

        @media (max-width: $layout-desktop-width) {
            .p-menubar-root-list {
                padding: 0;
                gap: 0;
                overflow: hidden;
            }

            .p-menubar-item {
                border-width: 0 0 1px 0;
                border-radius: 0;
            }

            .p-menubar-item:last-child {
                border-width: 0;
            }
        }
    }
}
</style>
