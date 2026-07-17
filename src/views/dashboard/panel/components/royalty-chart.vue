<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue"
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
} from "chart.js"
import type { ChartData } from "@c/charts/definitions/charts"
import { getBackgroundColors } from "@c/charts/utils/months-bar-chart"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import { formatNumber } from "@/lib/utils"

const props = withDefaults(
    defineProps<{
        data:       RoyaltyData[]
        isLoading?: boolean
    }>(),
    {
        data:      () => [],
        isLoading: false,
    },
)

export interface RoyaltyData {
    month:          string
    income_total:   number
    royalty_amount: number
}

interface RoyaltyChartData extends ChartData {
    royalty: number
}


Chart.register(BarController, BarElement, CategoryScale, LinearScale)

const chartRef = useTemplateRef<HTMLCanvasElement>("chartRef")
let chartInstance: Chart | null = null

const getCssVar = (varName: string, fallback: string) => {
    if (typeof document === "undefined") return fallback
    return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim() || fallback
}

const chartData = computed<RoyaltyChartData[]>(() => {
    if (props.isLoading || !props.data || props.data.length === 0) {
        return Array.from({ length: 6 }, () => ({
            label:      "",
            value:      0,
            isMock:     true,
            isSkeleton: true,
            percent:    0,
            royalty:    0,
        }))
    }

    return props.data.map((d) => {
        const date = new Date(d.month)
        const monthName = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date)
        const label = monthName.charAt(0).toUpperCase() + monthName.slice(1)

        return {
            label,
            value:      d.income_total,
            isMock:     !d.income_total || d.income_total <= 0,
            isSkeleton: false,
            percent:    0,
            royalty:    d.royalty_amount,
        }
    })
})

const yAxisConfig = computed(() => {
    if (chartData.value.length === 0 || chartData.value[0].isSkeleton) {
        return { max: 140000000, stepSize: 20000000 }
    }

    const maxBarSum = Math.max(...chartData.value.map(d => d.value + d.royalty), 1000000)

    const rawStep = maxBarSum / 5
    let stepSize = 10000000

    if (rawStep > 20000000) {
        stepSize = Math.ceil(rawStep / 10000000) * 10000000
    } else if (rawStep > 10000000) {
        stepSize = 20000000
    } else if (rawStep > 5000000) {
        stepSize = 10000000
    } else {
        stepSize = 5000000
    }

    const dynamicMax = Math.ceil(maxBarSum / stepSize) * stepSize + (stepSize * 2)

    return {
        max: dynamicMax,
        stepSize,
    }
})

const initChart = () => {
    if (!chartRef.value) return

    const ctx = chartRef.value.getContext("2d")
    if (!ctx) return

    const blueColor = getCssVar("--p-primary-900", "#3b82f6")
    const ticksColor = getCssVar("--p-neutral-400", "#94a3b8")

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels:   chartData.value.map((d) => d.label),
            datasets: [
                {
                    label:           "Роялти",
                    data:            chartData.value.map((d) => d.royalty),
                    backgroundColor: blueColor,
                    borderRadius:    6,
                    minBarLength:    30,
                },
                {
                    label:           "Оборот сети",
                    data:            chartData.value.map((d) => d.value),
                    backgroundColor: getBackgroundColors(ctx, chartData.value, false),
                    borderRadius:    6,
                },
            ],
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            events:              [],
            plugins:             {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    grid:    { display: false },
                    ticks:   { color: ticksColor },
                },
                y: {
                    stacked:  true,
                    type:     "linear",
                    position: "left",
                    max:      yAxisConfig.value.max,
                    grid:     { color: "rgba(51, 65, 85, 0.3)" },
                    ticks:    {
                        color:    ticksColor,
                        stepSize: yAxisConfig.value.stepSize,
                        callback: function (value) {
                            return `${(Number(value) / 1_000_000).toFixed(1)} млн`
                        },
                    },
                    title: {
                        display: true,
                        text:    "Сумма в рублях",
                        color:   ticksColor,
                    },
                },
            },
        },
        plugins: [
            {
                id: "customBarLabels",
                afterDraw(chartInst) {
                    const canvasCtx = chartInst.ctx
                    canvasCtx.save()
                    canvasCtx.font = "bold 11px sans-serif"
                    canvasCtx.textAlign = "center"

                    const metaRoyalty = chartInst.getDatasetMeta(0)
                    const metaTurnover = chartInst.getDatasetMeta(1)

                    chartData.value.forEach((dataItem, i) => {
                        if (dataItem.isSkeleton) return

                        // 1. Цифры для Роялти (снизу)
                        const barRoyalty = metaRoyalty.data[i] as any
                        if (barRoyalty && dataItem.royalty > 0) {
                            canvasCtx.fillStyle = "#ffffff"
                            canvasCtx.textBaseline = "middle"

                            // Безопасный расчет центра: смещаемся вниз от верхней точки (y)
                            // ровно на половину высоты самого бара (высота = base - y)
                            const height = barRoyalty.base - barRoyalty.y
                            const middleY = barRoyalty.y + (height / 2)

                            canvasCtx.fillText(
                                formatNumber(dataItem.royalty),
                                barRoyalty.x,
                                middleY,
                            )
                        }

                        // 2. Цифры для Оборота сети (сверху)
                        const barTurnover = metaTurnover.data[i] as any
                        if (barTurnover && dataItem.value > 0) {
                            canvasCtx.fillStyle = "#ffffff"
                            canvasCtx.textBaseline = "bottom"

                            // Выводим текст строго над верхней границей верхнего бара
                            canvasCtx.fillText(
                                formatNumber(dataItem.value),
                                barTurnover.x,
                                barTurnover.y - 4,
                            )
                        }
                    })

                    canvasCtx.restore()
                },
            },
        ],
    })
}

const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
    }
}

watch(
    () => props.isLoading,
    async (loading) => {
        if (!loading) {
            await nextTick()
            initChart()
        } else {
            destroyChart()
        }
    },
)

watch(
    () => chartData.value,
    (newData) => {
        if (!chartInstance) return
        const ctx = chartInstance.ctx

        chartInstance.data.labels = newData.map((d) => d.label)
        chartInstance.data.datasets[0].data = newData.map((d) => d.royalty)
        chartInstance.data.datasets[1].data = newData.map((d) => d.value)
        chartInstance.data.datasets[1].backgroundColor = getBackgroundColors(ctx, newData, false)

        chartInstance.update()
    },
    { deep: true },
)

onMounted(() => {
    if (!props.isLoading) {
        initChart()
    }
})

onBeforeUnmount(() => {
    destroyChart()
})
</script>

<template>
    <div class="royalty-chart">
        <list-loading-state
            v-if="props.isLoading"
        />

        <template v-else>
            <div class="royalty-chart-header">
                <div class="royalty-chart-header-group">
                    <div class="title">Финансовый оборот и роялти</div>
                    <div class="description">Анализ валового дохода сети и расчетных сервисных сборов</div>
                </div>

                <div class="chart-legend">
                    <div class="chart-legend-item">
                        <span class="legend-color legend-color-total" />
                        <span class="chart-legend-label">Оборот сети</span>
                    </div>
                    <div class="chart-legend-item">
                        <span class="legend-color legend-color-royalty" />
                        <span class="chart-legend-label">Роялти</span>
                    </div>
                </div>
            </div>

            <div class="royalty-chart-body">
                <canvas ref="chartRef" />
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.royalty-chart {
    @include list-view;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: $indent-x2;
    border: 1px solid var(--p-surface-600);

    &-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $indent-x1;
        margin-bottom: $indent-x2;

        &-group {
            .description {
                @include small-text;

                color: var(--p-surface-400);
            }
        }
    }

    &-body {
        position: relative;
        height: 20rem;
        width: 100%;
    }

    .chart-legend {
        display: flex;
        align-items: center;
        gap: $indent-x1;

        &-item {
            display: flex;
            align-items: center;
            gap: $indent-x1;
        }

        &-label {
            @include small-text;

            color: var(--p-surface-0);
        }
    }

    .legend-color {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 2px;
        display: inline-block;

        &-total {
            background-color: var(--p-primary-400);
            border: 1px solid var(--p-primary-700);
        }

        &-royalty {
            background-color: var(--p-primary-900);
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: var(--p-primary-900);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
</style>
