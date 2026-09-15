<script setup lang="ts">
import { computed, ref } from "vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import type { TicketsPeriodsData } from "@v/dashboard/panel/definitions/panel"
import { periodOptions } from "@v/dashboard/panel/utils/panel"
import { PeriodOptions } from "@/definitions/period"

const props = defineProps<{
    title:     string
    data:      TicketsPeriodsData
    isLoading: boolean
}>()

const current = ref(PeriodOptions.SevenDays)
const selectedValue = computed(() => {
    return props.data[current.value]
})

// Вычисляем процент изменения текущего периода к предыдущему
const percentageChange = computed(() => {
    const curr = selectedValue.value.current
    const prev = selectedValue.value.previous

    if (prev === 0) {
        return curr > 0
            ? { text: "+100%", isPositive: true }
            : { text: "0%", isPositive: true }
    }

    const diffPercent = Math.round(((curr - prev) / prev) * 100)

    return {
        text:       diffPercent >= 0 ? `+${diffPercent}%` : `${diffPercent}%`,
        isPositive: diffPercent >= 0,
    }
})
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        width="100%"
        class="panel-period-card"
    />

    <div
        v-else
        class="panel-period-card"
    >
        <div class="panel-period-card-header">
            <span class="label"> {{ props.title }} </span>

            <b-select-button
                v-model="current"
                :options="periodOptions"
                option-label="name"
                option-value="id"
            />
        </div>

        <div class="panel-period-card-wrapper">
            <span class="value">{{ selectedValue.current }}</span>
            <span class="subtext">
                За прошлый аналогичный период: {{ selectedValue.previous }}
                <span
                    class="trend"
                    :class="percentageChange.isPositive ? 'trend-up' : 'trend-down'"
                >
                    {{ percentageChange.text }}
                </span>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel-period-card {
    @include list-view;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 12rem;
    padding: $indent-x2;
    border: 1px solid var(--p-panel-border-color);

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    &-wrapper {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        gap: $indent-x1;
        margin-top: $indent-x1;

        .value {
            @include h2;

            font-weight: 800;
        }

        .subtext {
            @include small-text;

            text-wrap: nowrap;
            color: var(--p-panel-subtext);
        }

        .trend {
            font-weight: 600;
            padding: 0.125rem 0.375rem;
            margin-left: 0.125rem;
            border-radius: 0.25rem;

            &-up {
                background-color: var(--p-panel-period-trend-up-background);
                color: var(--p-panel-period-trend-up-color);
            }

            &-down {
                background-color: var(--p-panel-period-trend-down-background);
                color: var(--p-panel-period-trend-down-color);
            }
        }
    }
}
</style>
