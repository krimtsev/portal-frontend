<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"

interface SectionItem {
    label: string
    link?: string
    active?: boolean
}

interface Section {
    title: string
    items: SectionItem[]
}

const sections: Section[] = [
    {
        title: "Инструкции",
        items: [
            { label: "Настройка переадресации MANGO" },
            { label: "Всплывающие уведомления YCLIENTS" },
            { label: "Настройка WAHELP" },
            { label: "Настройка изменения цен ЭВОТОР" }
        ]
    },
    {
        title: "Обучение",
        items: [
            { label: "Перейти на портал обучения" },
            { label: "Курсы для сотрудников" }
        ]
    },
    {
        title: "Отчеты",
        items: [
            { label: "Таблица оплаты телефонии" },
            { label: "Таблица маркет. сбора" }
        ]
    },
    {
        title: "Документация",
        items: [
            { label: "Система работы абонементов" },
            { label: "Система работы сертификатов" },
            { label: "Штрафы" },
            { label: "Штрафы по аудиту" },
            { label: "Бальная система по манго-аудиту" }
        ]
    },
    {
        title: "Дополнительные услуги",
        items: [
            { label: "Платные услуги ЦО" },
            { label: "Подписка Яндекс.Карты и 2ГИС" },
            { label: "Сервис пропущенных звонков" },
            { label: "Сервис аналитики показателей" }
        ]
    },
    {
        title: "Контакты",
        items: [
            { label: "Сотрудников ЦО" },
            { label: "Владельцев франшиз", active: true },
            { label: "Партнеров" },
            { label: "Полезные контакты" }
        ]
    },
    {
        title: "Дополнительно",
        items: [
            { label: "KPI франшизы (регионы)" },
            { label: "Корпоративные скидки" }
        ]
    }
]
</script>

<template>
    <portal-card title="Информация">
        <div class="information-block">
            <div class="column" v-for="(section, index) in sections" :key="index">
                <div class="section-title">{{ section.title }}</div>
                <div
                    v-for="(item, idx) in section.items"
                    :key="idx"
                    class="section-item"
                    :class="{ active: item.active }"
                >
                    <a v-if="item.link" :href="item.link" target="_blank">{{ item.label }}</a>
                    <span v-else>{{ item.label }}</span>
                </div>
            </div>
        </div>
    </portal-card>
</template>

<style scoped lang="scss">
.information-block {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;

    .column {
        min-width: 160px;
        max-width: 200px;
    }

    .section-title {
        font-weight: bold;
        margin-bottom: 12px;
        font-size: 15px;
        color: #ccc;
    }

    .section-item {
        margin-bottom: 6px;
        font-size: 14px;

        a,
        span {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;

            &:hover {
                color: #fff;
            }
        }

        &.active a,
        &.active span {
            color: #b5ff65;
        }
    }
}
</style>
