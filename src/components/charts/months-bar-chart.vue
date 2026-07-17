<script setup lang="ts">
import {
    computed,
    onBeforeUnmount,
    onMounted,
    useTemplateRef,
    watch,
} from "vue"
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js"
import type {
    ChartData,
    MonthsBarChartData,
} from "@c/charts/definitions/charts"
import { getBackgroundColors } from "@c/charts/utils/months-bar-chart"

const props = withDefaults(
    defineProps<{
        data:           MonthsBarChartData
        isLoading?:     boolean
        limit?:         number
        highlightLast?: boolean
    }>(),
    {
        data:          () => ({}),
        isLoading:     false,
        limit:         4,
        highlightLast: false,
    },
)

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const chartCanvasRef = useTemplateRef<HTMLCanvasElement>("chartCanvasRef")
let chart: Chart<"bar", number[], string> | null = null

const chartData = computed((): ChartData[] => {
    const skeleton = Array.from({ length: props.limit }, (_, i) => ({
        label:      "",
        value:      [200, 150, 300, 450, 250, 350][i % 6],
        isMock:     true,
        percent:    0,
        isSkeleton: true,
    }))

    if (props.isLoading || !props.data || Object.keys(props.data).length === 0) {
        return skeleton
    }

    const entries = Object.entries(props.data).sort((a, b) => a[0].localeCompare(b[0]))
    const lastFour = entries.slice(-props.limit)

    return lastFour.map(([dateString, item]) => {
        const date = new Date(dateString)
        const monthName = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date)
        const label = monthName.charAt(0).toUpperCase() + monthName.slice(1)

        const isMock = !item.value || item.value <= 0

        return {
            label,
            value:      isMock ? 0 : item.value,
            isMock,
            percent:    item.percent,
            isSkeleton: false,
        }
    })
})

function drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
    const padding = 8
    const rectHeight = 20
    const borderRadius = 8
    const textMetrics = ctx.measureText(text)
    const rectWidth = textMetrics.width + padding * 2

    const rectX = x - rectWidth / 2
    const rectY = y - rectHeight + 2

    ctx.fillStyle = "rgba(217, 217, 217, 0.2)"
    ctx.beginPath()
    ctx.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius)
    ctx.fill()

    ctx.fillStyle = "#fff"
    ctx.textBaseline = "middle"
    ctx.fillText(text, x, rectY + rectHeight / 2)
}

function createChart(ctx: CanvasRenderingContext2D) {
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels:   chartData.value.map(d => d.label),
            datasets: [
                {
                    data:            chartData.value.map(d => d.value),
                    backgroundColor: getBackgroundColors(ctx, chartData.value, props.highlightLast),
                    borderRadius:    24,
                    borderSkipped:   false,
                    minBarLength:    55,
                    barThickness:    "flex",
                },
            ],
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            layout:              {
                padding: { top: 60, bottom: 24 },
            },
            scales: {
                x: {
                    grid:   { display: false },
                    ticks:  { display: false },
                    offset: true,
                },
                y: {
                    display:     false,
                    grid:        { display: false },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend:  { display: false },
                tooltip: { enabled: false },
            },
            animation: {
                duration: 1000,
                easing:   "easeOutQuart",
            },
        },
        plugins: [
            {
                id: "dynamicBarThickness",
                afterLayout(chartInstance) {
                    const totalBars = chartInstance.data.labels?.length || 4
                    const chartWidth = chartInstance.chartArea?.width || 0
                    if (chartWidth > 0) {
                        const totalSpacing = (totalBars - 1) * 8
                        const thickness = (chartWidth - totalSpacing) / totalBars
                        const dataset = chartInstance.data.datasets[0]
                        if (dataset) {
                            dataset.barThickness = thickness
                        }
                    }
                },
            },
            {
                id: "customLabels",
                afterDraw(chartInstance) {
                    const canvasCtx = chartInstance.ctx
                    const meta = chartInstance.getDatasetMeta(0)
                    const labels = chartInstance.data.labels as string[]

                    canvasCtx.save()
                    canvasCtx.font = "14px 'Akzidenz-Grotesk Pro'"
                    canvasCtx.textAlign = "center"

                    meta.data.forEach((bar, i) => {
                        const barProps = bar as unknown as { x: number, y: number, base: number }
                        const x = barProps.x
                        const topY = barProps.y
                        const bottomY = barProps.base
                        const dataItem = chartData.value[i]

                        if (!dataItem) return

                        // Название месяца
                        canvasCtx.fillStyle = "rgba(255, 255, 255, 0.4)"
                        canvasCtx.textBaseline = "top"
                        canvasCtx.fillText(labels[i] || "", x, bottomY + 8)

                        // Универсальное значение (value)
                        if (!dataItem.isSkeleton) {
                            canvasCtx.fillStyle = getComputedStyle(document.documentElement)
                                .getPropertyValue("--p-surface-100")
                                .trim()
                            canvasCtx.textBaseline = "bottom"
                            canvasCtx.fillText(dataItem.value.toLocaleString("ru-RU"), x, topY - 8)
                        }

                        // Бейдж с процентами
                        if (!dataItem.isSkeleton && !dataItem.isMock && dataItem.percent !== undefined) {
                            const sign = dataItem.percent > 0 ? "+" : ""
                            drawBadge(canvasCtx, x, bottomY - 24, `${sign}${dataItem.percent}%`)
                        }
                    })
                    canvasCtx.restore()
                },
            },
        ],
    })
}

watch(
    [chartData, () => props.highlightLast],
    ([newData, highlightLast]) => {
        if (!chart) return

        const ctx = chart.ctx

        chart.data.labels = newData.map(d => d.label)
        chart.data.datasets[0].data = newData.map(d => d.value)
        chart.data.datasets[0].backgroundColor = getBackgroundColors(
            ctx,
            newData,
            highlightLast,
        )

        chart.update()
    },
    { deep: true },
)

onMounted(() => {
    if (!chartCanvasRef.value) return
    const ctx = chartCanvasRef.value.getContext("2d")
    if (ctx) {
        chart = createChart(ctx)
    }
})

onBeforeUnmount(() => {
    if (chart) {
        chart.destroy()
        chart = null
    }
})
</script>

<template>
    <div class="months-bar-chart">
        <canvas ref="chartCanvasRef" />
    </div>
</template>

<style scoped lang="scss">
.months-bar-chart {
    width: 100%;
    min-height: 250px;
}
</style>
