<script setup lang="ts">
import { computed } from "vue"
import PrimeProgressBar from "primevue/progressbar"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import type { TicketsEfficiencyData } from "@v/dashboard/panel/definitions/panel"
import { formatMinutes } from "@/lib/utils"

const props = defineProps<{
    data:      TicketsEfficiencyData
    isLoading: boolean
}>()

const averageTime = computed(() => formatMinutes(props.data.average_time))
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        width="100%"
        class="ticket-efficiency"
    />

    <div
        v-else
        class="ticket-efficiency"
    >
        <div class="ticket-efficiency-header">
            <span class="label"> Эффективность работы </span>
        </div>

        <div class="ticket-efficiency-wrapper">
            <div class="ticket-efficiency-item">
                <div class="ticket-efficiency-item-info">
                    <span class="ticket-efficiency-item-label">Успешность закрытия</span>
                    <span class="ticket-efficiency-item-value">{{ props.data.success_rate_percentage }}%</span>
                </div>
                <div class="ticket-efficiency-progress-bar">
                    <prime-progress-bar
                        :value="props.data.success_rate_percentage"
                        :show-value="false"
                        class="progress"
                    />
                </div>
            </div>

            <div class="ticket-efficiency-item">
                <div class="ticket-efficiency-item-info">
                    <span class="ticket-efficiency-item-label">Среднее время до закрытия</span>
                    <span class="ticket-efficiency-item-value">{{ averageTime }}</span>
                </div>
                <p class="ticket-efficiency-item-subtext">Разница между созданием и выполнением</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.ticket-efficiency {
    @include list-view;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 12rem;
    padding: $indent-x2;
    border: 1px solid var(--p-surface-600);

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &-wrapper {
        display: flex;
        flex-direction: column;
        gap: $indent-x1;
        margin-top: $indent-x1;
    }

    &-item {
        &-info {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }

        &-label {
            color: var(--p-surface-400);
        }

        &-value {
            @include h4;

            line-height: inherit;
            font-weight: 800;
            color: var(--p-surface-0);
        }

        &-subtext {
            @include small-text;

            line-height: inherit;
            color: var(--p-surface-500);
        }
    }

    .progress {
        height: 8px;
        width: 100%;
        margin-top: $indent-x1;
    }
}
</style>
