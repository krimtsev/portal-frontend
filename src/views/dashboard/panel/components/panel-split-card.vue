<script setup lang="ts">
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import { formatNumber } from "@/lib/utils"

export interface PanelSplitMetric {
    label:    string
    value:    number
    variant?: "success" | "neutral" | "danger" | "warning" | "info"
}

const props = defineProps<{
    title:      string
    total:      number
    subtext?:   string
    metrics:    PanelSplitMetric[]
    isLoading?: boolean
}>()
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        width="100%"
        class="panel-activity-card"
    />

    <div
        v-else
        class="panel-activity-card"
    >
        <div class="panel-activity-card-header">
            <span class="label"> {{ props.title }} </span>
        </div>

        <div class="panel-activity-card-wrapper">
            <div class="panel-activity-card-total">
                <span class="panel-activity-card-total-value">{{ formatNumber(props.total) }}</span>
                <span class="panel-activity-card-total-subtext"> {{ props.subtext }} </span>
            </div>

            <div class="panel-activity-card-split">
                <div
                    v-for="(metric, index) in props.metrics"
                    :key="index"
                    class="metric"
                    :class="[`metric-${metric.variant || 'neutral'}`]"
                >
                    <span class="metric-label">{{ metric.label }}</span>
                    <span class="metric-value">{{ formatNumber(metric.value) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel-activity-card {
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
        align-items: center;
        gap: $indent-x2;
        margin-top: $indent-x1;
    }

    &-total {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        gap: 8px;
        border-right: 1px solid var(--p-surface-600);
        padding-right: $indent-x2;

        &-value {
            @include h2;
            font-weight: 800;
        }

        &-subtext {
            @include small-text;
            color: var(--p-surface-400);
        }
    }

    &-split {
        display: flex;
        flex-direction: column;
        gap: $indent-x1;
        flex: 1;
    }

    .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;

        color: var(--p-neutral-400);

        &-label {
            font-size: 0.8125rem;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 0.375rem;

            &::before {
                content: '';
                width: 0.375rem;
                height: 0.375rem;
                border-radius: 50%;
                display: inline-block;
                background-color: currentColor;
            }
        }

        &-value {
            font-weight: 600;
        }

        &-success {
            color: var(--p-green-400);

            ::before {
                background-color: var(--p-green-400);
            }
        }
        &-neutral {
            color: var(--p-neutral-400);

            ::before {
                background-color: var(--p-neutral-400);
            }
        }
        &-danger  {
            color: var(--p-red-400);

            ::before {
                background-color: var(--p-red-400);
            }
        }
        &-warning {
            color: var(--p-orange-400);

            ::before {
                background-color: var(--p-orange-400);
            }
        }
        &-info {
            color: var(--p-blue-400);

            ::before {
                background-color: var(--p-blue-400);
            }
        }
    }
}
</style>
