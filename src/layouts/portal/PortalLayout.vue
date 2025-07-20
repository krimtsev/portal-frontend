<script setup lang="ts">
import Menubar from "primevue/menubar"
import BImage from "@c/common/b-image/b-image.vue"
import BLink from "@c/common/b-link/b-link.vue"

const menuItems = [
    {
        label: 'Информация',
        command: () => {
            console.log('Перейти на главную')
        }
    },
    {
        label: 'Заявки',
        command: () => {
            console.log('Перейти в профиль')
        }
    },
    {
        label: 'Поиск сертификатов',
        command: () => {
            console.log('Перейти в настройки')
        }
    },
    {
        label: 'Доп. услуги',
        command: () => {
            console.log('Перейти в настройки')
        }
    },
    {
        label: 'Контакты',
        command: () => {
            console.log('Перейти в настройки')
        }
    }
]
</script>

<template>
    <div class="portal-layout">
        <div class="wrapper">
            <Menubar :model="menuItems">
                <template #start>
                    <b-image src="logos/logo.png" />
                </template>
                <template #end>
                    <b-link label="Профиль" variant="link" :ripple="false" plain /> |
                    <b-link label="Панель администратора" variant="link" severity="success" /> |
                    <b-link label="Выйти"  />
                </template>
            </Menubar>

            <!-- Main Content -->
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

    .wrapper {
        margin: 0 auto;
        max-width: $layout-max-width;
        width: $layout-max-width;
        padding: $indent-x4 $indent-x1 $indent-x1;
    }

    :deep(.p-menubar) {
        background: transparent;
        border: none;
        border-radius: 0;
        margin-bottom: 64px;

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
        }
    }
}
</style>
