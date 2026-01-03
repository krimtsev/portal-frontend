<template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js"

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const chartCanvas = ref(null)
let chart = null

function createDiagonalPattern(ctx, color = "rgba(255,255,255,0.08)") {
    const patternCanvas = document.createElement("canvas")
    const size = 20
    patternCanvas.width = size
    patternCanvas.height = size
    const pctx = patternCanvas.getContext("2d")

    pctx.fillStyle = "rgba(0,0,0,0)"
    pctx.fillRect(0, 0, size, size)

    pctx.strokeStyle = color
    pctx.lineWidth = 3
    pctx.beginPath()
    pctx.moveTo(0, size)
    pctx.lineTo(size, 0)
    pctx.stroke()

    return ctx.createPattern(patternCanvas, "repeat")
}

function createGradient(ctx) {
    const startColor = getComputedStyle(document.documentElement).getPropertyValue("--p-primary-500").trim()
    const endColor = getComputedStyle(document.documentElement).getPropertyValue("--p-primary-700").trim()

    const gradient = ctx.createLinearGradient(0, 0, 0, 250)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    return gradient
}

function drawBadge(ctx, x, y, text) {
    const padding = 8
    const rectHeight = 20
    const borderRadius = 8
    const textMetrics = ctx.measureText(text)
    const rectWidth = textMetrics.width + padding * 2

    // прямоугольник
    const rectX = x - rectWidth / 2
    const rectY = y - rectHeight + 2 // поправка, чтобы текст был по центру

    ctx.fillStyle = "rgba(217, 217, 217, 0.2)"

    ctx.beginPath()
    ctx.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius)
    ctx.fill()

    // текст поверх блока
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "middle"
    ctx.fillText(text, x, rectY + rectHeight / 2)
}

function createChart(ctx) {
    const pattern = createDiagonalPattern(ctx)
    const gradient = createGradient(ctx)

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Февраль", "Март", "Апрель", "Май"],
            datasets: [
                {
                    data: [10, 20, 15, 24],
                    backgroundColor: [pattern, pattern, pattern, gradient],
                    borderRadius: 24,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 60 },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { display: false },
                    offset: true,
                },
                y: {
                    display: false,
                    grid: { display: false },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
            },
            animation: {
                duration: 1000,
                easing: "easeOutQuart",
            },
        },
        plugins: [
            {
                id: "customLabels",
                afterDraw(chart) {
                    const ctx = chart.ctx
                    const meta = chart.getDatasetMeta(0)
                    const labels = chart.data.labels
                    //const dataset = chart.data.datasets[0]

                    ctx.save()
                    ctx.font = "14px 'Akzidenz-Grotesk Pro'"
                    ctx.textAlign = "center"

                    meta.data.forEach((bar, i) => {
                        const x = bar.x
                        const topY = bar.y
                        const bottomY = bar.base

                        // Название месяца над баром
                        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
                        ctx.textBaseline = "bottom"
                        ctx.fillText(labels[i], x, topY - 24)

                        // "+24%" внутри бара только у мая
                        if (i === 3) {
                            drawBadge(ctx, x, bottomY - 24, "+24%")
                        }
                    })
                    ctx.restore()
                },
            },
        ],
    })
}

onMounted(() => {
    const ctx = chartCanvas.value.getContext("2d")
    chart = createChart(ctx)

    chart.options.scales.x.barPercentage = 1
    chart.options.scales.x.categoryPercentage = 1
    chart.data.datasets[0].barThickness = () => {
        const totalBars = chart.data.labels.length
        const chartWidth = chart.chartArea.width
        const totalSpacing = (totalBars - 1) * 8
        return (chartWidth - totalSpacing) / totalBars
    }
})

onBeforeUnmount(() => {
    if (chart) {
        chart.destroy()
        chart = null
    }
})
</script>

<style scoped lang="scss">
.chart-container {
    width: 100%;
    min-height: 250px;
    padding: $indent-x1 $indent-x3 0;
}
</style>
