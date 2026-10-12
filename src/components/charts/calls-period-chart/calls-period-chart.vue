<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue"
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
} from "chart.js"
import { getCssVar } from "@c/charts/months-bar-chart/utils/months-bar-chart"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel"
import { formatNumber } from "@/lib/utils"

const props = withDefaults(
    defineProps<{
        data:       MangoCallsData[]
        isLoading?: boolean
    }>(),
    {
        data:      () => [],
        isLoading: false,
    },
)

Chart.register(BarController, BarElement, CategoryScale, LinearScale)

const chartRef = useTemplateRef<HTMLCanvasElement>("chartRef")
let chartInstance: Chart | null = null

const chartData = computed(() => {
    return props.data || []
})

const initChart = () => {
    if (!chartRef.value) return
    const ctx = chartRef.value.getContext("2d")
    if (!ctx) return

    const ticksColor = getCssVar("--p-panel-calls-period-ticks", "#C8C8C8")
    const valueColor = getCssVar("--p-panel-calls-period-legend-label", "#C8C8C8")

    const incomingGradient = getCssVar("--p-panel-calls-period-income", "#65A30D")
    const missedGradient = getCssVar("--p-panel-calls-period-missed", "#991b1b")

    const labels = chartData.value.map(d => d.time)
    const incomingData = chartData.value.map(d => d.incoming)
    const missedData = chartData.value.map(d => d.missed)

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label:           "Принятые",
                    data:            incomingData,
                    backgroundColor: incomingGradient,
                    borderRadius:    6,
                    stack:           "CallsStack",
                },
                {
                    label:           "Пропущенные",
                    data:            missedData,
                    backgroundColor: missedGradient,
                    borderRadius:    6,
                    stack:           "CallsStack",
                },
            ],
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            events:              [],
            layout:              {
                padding: {
                    top:   22,
                    left:  4,
                    right: 4,
                },
            },
            plugins: {
                legend:  { display: false },
                tooltip: { enabled: false },
            },
            scales: {
                x: {
                    stacked: true,
                    grid:    { display: false },
                    ticks:   {
                        color:       ticksColor,
                        maxRotation: 0,
                        autoSkip:    false,
                    },
                },
                y: {
                    stacked:     true,
                    beginAtZero: true,
                    grace:       "15%",
                    grid:        { color: "rgba(51, 65, 85, 0.3)" },
                    ticks:       {
                        color:         ticksColor,
                        maxTicksLimit: 5,
                        precision:     0,
                    },
                },
            },
        },
        plugins: [
            {
                id: "customStackedLabels",
                afterDraw(chartInst) {
                    const canvasCtx = chartInst.ctx
                    canvasCtx.save()
                    // Компактный шрифт для отображения внутри 12 часовых колонок
                    canvasCtx.font = "bold 0.75rem sans-serif"
                    canvasCtx.textAlign = "center"

                    const metaIncoming = chartInst.getDatasetMeta(0)
                    const metaMissed = chartInst.getDatasetMeta(1)

                    chartData.value.forEach((dataItem, i) => {
                        const barIncoming = metaIncoming.data[i] as any
                        const barMissed = metaMissed.data[i] as any

                        // 1. Отрисовка числа для принятых
                        if (barIncoming && dataItem.incoming > 0) {
                            const height = barIncoming.base - barIncoming.y

                            if (height >= 16) {
                                canvasCtx.fillStyle = "#ffffff"
                                canvasCtx.textBaseline = "middle"
                                canvasCtx.fillText(
                                    formatNumber(dataItem.incoming),
                                    barIncoming.x,
                                    barIncoming.y + (height / 2),
                                )
                            } else if (dataItem.missed === 0) {
                                canvasCtx.fillStyle = valueColor
                                canvasCtx.textBaseline = "bottom"
                                canvasCtx.fillText(
                                    formatNumber(dataItem.incoming),
                                    barIncoming.x,
                                    barIncoming.y - 3,
                                )
                            } else {
                                canvasCtx.fillStyle = valueColor
                                canvasCtx.textBaseline = "bottom"
                                canvasCtx.fillText(
                                    formatNumber(dataItem.incoming),
                                    barIncoming.x,
                                    barIncoming.base - 3,
                                )
                            }
                        }

                        // 2. Отрисовка числа для пропущенных
                        if (barMissed && dataItem.missed > 0) {
                            canvasCtx.fillStyle = valueColor
                            canvasCtx.textBaseline = "bottom"
                            canvasCtx.fillText(
                                formatNumber(dataItem.missed),
                                barMissed.x,
                                barMissed.y - 3,
                            )
                        }
                    })

                    canvasCtx.restore()
                },
            },
        ],
    })
}

const updateChart = () => {
    if (!chartInstance) return

    chartInstance.data.labels = chartData.value.map(d => d.time)
    chartInstance.data.datasets[0].data = chartData.value.map(d => d.incoming)
    chartInstance.data.datasets[1].data = chartData.value.map(d => d.missed)

    chartInstance.update()
}

const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
    }
}

watch(() => props.isLoading, async (loading) => {
    if (!loading) {
        await nextTick()
        if (!chartInstance) {
            initChart()
        } else {
            updateChart()
        }
    } else {
        destroyChart()
    }
})

watch(() => props.data, () => {
    if (chartInstance) updateChart()
}, { deep: true })

onMounted(() => {
    if (!props.isLoading) initChart()
})

onBeforeUnmount(() => {
    destroyChart()
})
</script>

<template>
    <div class="daily-calls-chart">
        <list-loading-state v-if="props.isLoading" />

        <template v-else>
            <div class="chart-header">
                <div class="chart-header-title-group">
                    <div class="title">Динамика звонков за 12 часов</div>
                </div>

                <div class="chart-legend">
                    <div class="chart-legend-item">
                        <span class="legend-color legend-color-incoming" />
                        <span class="chart-legend-label">Принятые</span>
                    </div>
                    <div class="chart-legend-item">
                        <span class="legend-color legend-color-missed" />
                        <span class="chart-legend-label">Пропущенные</span>
                    </div>
                </div>
            </div>

            <div class="chart-body">
                <canvas ref="chartRef" />
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.daily-calls-chart {
    @include list-view;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: $indent-x2;
    border: 1px solid var(--p-panel-border-color);

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $indent-x2;

        &-title-group {
            .title {
                color: var(--p-panel-value);
            }
        }
    }

    .chart-body {
        position: relative;
        height: 16rem;
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

            color: var(--p-panel-calls-period-legend-label);
        }
    }

    .legend-color {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 2px;
        display: inline-block;

        &-incoming {
            background-color: var(--p-panel-calls-period-income, #65A30D);
        }

        &-missed {
            background: var(--p-panel-calls-period-missed, #991b1b);
        }
    }
}
</style>
