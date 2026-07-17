<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { merge } from "lodash"
import { useAuthStore } from "@s/auth/auth"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as panelAPI from "@/api/modules/dashboard/panel/panel"
import BTitle from "@c/common/b-title/b-title.vue"
import PanelCard from "@v/dashboard/panel/components/panel-card.vue"
import PanelPeriodCard from "@v/dashboard/panel/components/panel-period-card.vue"
import PanelSplitCard, { type PanelSplitMetric } from "@v/dashboard/panel/components/panel-split-card.vue"
import RoyaltyChart from "@v/dashboard/panel/components/royalty-chart.vue"
import TicketEfficiency from "@v/dashboard/panel/components/ticket-efficiency.vue"
import type { AnalyticsData } from "@v/dashboard/panel/definitions/panel"
import { defaultAnalyticsData } from "@v/dashboard/panel/utils/panel"
import { formatNumber } from "@/lib/utils"

const notify = useNotify()
const authStore = useAuthStore()

const isLoading = ref(true)
const analutics = ref<AnalyticsData>(defaultAnalyticsData())

onMounted(async () => {
    isLoading.value = true

    const resp = await panelAPI.analytics()

    if (resp instanceof HttpError) {
        notify.error()
        return
    }

    analutics.value = merge(analutics.value, resp.data)

    isLoading.value = false
})

const ticketsCompleted = computed(() => {
    const { total_count, pending_count, new_count } = analutics.value.tickets

    const completedCount = total_count - (pending_count + new_count)
    const percent = total_count > 0
        ? Math.round((completedCount / total_count) * 100)
        : 0

    return {
        count: completedCount,
        percent,
    }
})

const partnerMetrics = computed((): PanelSplitMetric[] => {
    return [
        {
            label:   "Активные",
            value:   analutics.value.partners.active_count,
            variant: "success",
        },
        {
            label: "Неактивные",
            value: analutics.value.partners.inactive_count,
        },
    ]
})

const jobsMetrics = computed((): PanelSplitMetric[] => {
    return [
        {
            label: "default",
            value: analutics.value.jobs.default_count,
        },
        {
            label: "yclients",
            value: analutics.value.jobs.yclients_count,
        },
        {
            label:   "failed",
            value:   analutics.value.jobs.failed_count,
            variant: "danger",
        },
    ]
})
</script>

<template>
    <div class="panel-view">
        <header class="panel-header">
            <b-title
                title="Рабочая панель"
                class="panel-title"
            />
            <span class="panel-subtitle">Статистика портала и финансовые показатели</span>
        </header>

        <section class="first-section">
            <panel-card
                :is-loading="isLoading"
                :value="formatNumber(analutics.tickets.total_count)"
                title="Всего заявок на портале"
            />

            <panel-card
                :is-loading="isLoading"
                :value="formatNumber(analutics.tickets.new_count)"
                title="Новые заявки"
                status="new"
                subtext="ожидают обработки"
            />

            <panel-card
                :is-loading="isLoading"
                :value="formatNumber(analutics.tickets.pending_count)"
                title="В ожидании"
                status="waiting"
                subtext="требуют действия"
            />

            <panel-card
                :is-loading="isLoading"
                :value="formatNumber(ticketsCompleted.count)"
                :subtext="`${ticketsCompleted.percent}% от всех`"
                title="Выполнено"
                status="success"
            />
        </section>

        <section class="second-section">
            <panel-period-card
                :is-loading="isLoading"
                :data="analutics.periods"
                title="Поступило заявок"
            />

            <panel-split-card
                :is-loading="isLoading"
                title="Партнеры"
                :total="analutics.partners.total_count"
                subtext="всего партнеров"
                :metrics="partnerMetrics"
            />

            <ticket-efficiency
                :is-loading="isLoading"
                :data="analutics.efficiency"
            />
        </section>

        <section class="third-section">
            <royalty-chart
                :is-loading="isLoading"
                :data="analutics.royalty_stats"
            />
        </section>

        <section
            v-if="authStore.isSysAdmin"
            class="fourth-section"
        >
            <panel-split-card
                :is-loading="isLoading"
                title="Очереди задач"
                :total="analutics.jobs.total_count"
                subtext="всего в работе"
                :metrics="jobsMetrics"
            />
        </section>
    </div>
</template>

<style lang="scss" scoped>
.panel-view {
    display: flex;
    flex-direction: column;
    gap: $indent-x2;
    margin-top: $indent-x1;

    .panel-subtitle {
        color: var(--p-surface-400);
    }

    .first-section {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: $indent-x2;
    }

    .second-section,
    .fourth-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $indent-x2;
    }


}
</style>
