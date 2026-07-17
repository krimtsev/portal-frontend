import type { ChartData } from "@c/charts/definitions/charts"

export function createGradient(
    ctx: CanvasRenderingContext2D,
    startColorPrefix: string,
    endColorPrefix: string,
) {
    if (typeof document === "undefined") return "rgba(0,0,0,0.1)"

    const startColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`${startColorPrefix}`)
        .trim()
    const endColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`${endColorPrefix}`)
        .trim()

    const gradient = ctx.createLinearGradient(0, 0, 0, 250)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    return gradient
}

export function createDiagonalPattern(ctx: CanvasRenderingContext2D, color = "rgba(255,255,255,0.08)") {
    const patternCanvas = document.createElement("canvas")
    const size = 20
    patternCanvas.width = size
    patternCanvas.height = size
    const pctx = patternCanvas.getContext("2d")

    if (!pctx) return "rgba(0,0,0,0.1)"

    pctx.fillStyle = "rgba(0,0,0,0)"
    pctx.fillRect(0, 0, size, size)

    pctx.strokeStyle = color
    pctx.lineWidth = 3
    pctx.beginPath()
    pctx.moveTo(0, size)
    pctx.lineTo(size, 0)
    pctx.stroke()

    return ctx.createPattern(patternCanvas, "repeat") || "rgba(0,0,0,0.1)"
}

export function getBackgroundColors(ctx: CanvasRenderingContext2D, data: ChartData[], highlightLast: boolean) {
    const pattern = createDiagonalPattern(ctx)

    return data.map((d, index) => {
        if (d.isMock) return pattern

        if (highlightLast) {
            const isLast = index === data.length - 1
            if (isLast) {
                return createGradient(
                    ctx,
                    d.percent >= 0 ? "--p-primary-400" : "--p-red-400",
                    d.percent >= 0 ? "--p-primary-700" : "--p-red-700",
                )
            }
            return createGradient(ctx, "--p-neutral-700", "--p-neutral-900")
        }

        return createGradient(ctx, "--p-primary-400", "--p-primary-700")
    })
}
