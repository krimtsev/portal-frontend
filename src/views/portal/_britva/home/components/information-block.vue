<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import { portalPaths } from "@r/portal/path"
import { useRouter } from "vue-router"
import BLink from "@c/common/b-link/b-link.vue"

const router = useRouter()

interface SectionItem {
    label: string
    path?: string
    active?: boolean
    external?: string
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
            {
                label: "Перейти на портал обучения",
                external: "https://learn.mybritva.ru"
            },
            {
                label: "Курсы для сотрудников",
                external: "https://britva-education.ru"
            }
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
            {
                label: "Система работы абонементов",
                path:  portalPaths.DocumentSubscription,
            },
            {
                label: "Система работы сертификатов",
                path:  portalPaths.DocumentCertificate,
            },
            {
                label: "Штрафы",
                path:  portalPaths.DocumentFines,
            },
            {
                label: "Штрафы по аудиту",
                path:  portalPaths.DocumentFinesAudit,
            },
            {
                label: "Бальная система по манго-аудиту",
                path:  portalPaths.DocumentMangoAudit,
            }
        ]
    },
    {
        title: "Дополнительные услуги",
        items: [
            {
                label: "Платные услуги ЦО",
                path:  portalPaths.ServicePaidCO,
            },
            {
                label: "Подписка Яндекс.Карты и 2ГИС",
                path:  portalPaths.ServiceSubscription,
            },
            {
                label: "Сервис пропущенных звонков",
                path:  portalPaths.ServiceMissedCalls,
            },
            {
                label: "Сервис аналитики показателей",
                path:  portalPaths.ServiceUserAnalytics,
            }
        ]
    },
    {
        title: "Контакты",
        items: [
            { label: "Сотрудников ЦО" },
            { label: "Владельцев франшиз" },
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
    <portal-card
        title="Информация"
        menu-title
    >
        <div class="information-block grid">
            <div class="col-12" v-for="(section, index) in sections" :key="index">
                <div class="section-title">{{ section.title }}</div>
                <div
                    v-for="(item, idx) in section.items"
                    :key="idx"
                    class="section-item"
                >
                    <template v-if="item.path">
                        <b-link
                            v-if="item.path"
                            :label="item.label"
                            @click="router.push({ path: item.path })"
                        />
                        <span v-else>{{ item.label }}</span>
                    </template>
                    <template v-else-if="item.external">
                        <b-link
                            v-if="item.external"
                            :label="item.label"
                            :href="item.external"
                        />
                        <span v-else>{{ item.label }}</span>
                    </template>
                </div>
            </div>
        </div>
    </portal-card>
</template>

<style scoped lang="scss">
.information-block {
    @media (min-width: $layout-desktop-width) {
        &.grid {
            display: grid;
            grid-template-columns: repeat(calc(12 / 4), minmax(0, 1fr));
            gap: $indent-x1 calc($indent-x1 * 8);

            > * {
                grid-column: span 1;
                margin-bottom: $indent-x2;
                padding-left: $indent-x3;
            }
        }
    }

    .section-title {
        @include title(var(--p-surface-400));

        margin-bottom: $indent-x2;
    }

    .section-item {
        border-bottom: 1px solid var(--p-surface-600);
        padding: $indent-x1 $indent-x2;

        :deep(.button-link) {
            color: var(--p-surface-100);
            text-decoration: none;
            cursor: pointer;

            &:hover {
                color: var(--p-primary-700);
            }
        }
    }
}
</style>
