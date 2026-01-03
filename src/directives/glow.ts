import type { Directive } from "vue"

type GlowPosition =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | { x: string; y: string }

interface GlowOptions {
    color?: string
    blur?: number
    size?: number
    position?: GlowPosition
    opacity?: number
}

const STYLE_ID = "v-glow-style"

const glowDirective: Directive<HTMLElement, GlowOptions> = {
    mounted(el, binding) {

        if (!["relative", "absolute", "fixed"].includes(getComputedStyle(el).position)) {
            el.style.position = "relative"
        }

        const options = binding.value || {}

        const color = options.color ?? "rgba(255,255,255,0.9)"
        const blur = options.blur ?? 100
        const size = options.size ?? 150
        const opacity = options.opacity ?? 0.4
        const position = options.position ?? "center"

        // уникальный атрибут
        const uid = `glow-${Math.random().toString(36).slice(2)}`
        el.dataset.glowId = uid

        // CSS-переменные
        el.style.setProperty("--glow-size", `${size}px`)
        el.style.setProperty("--glow-blur", `${blur}px`)
        el.style.setProperty("--glow-color", color)
        el.style.setProperty("--glow-opacity", String(opacity))

        // позиционирование
        const setPosition = (pos: GlowPosition) => {
            let x = "50%"
            let y = "50%"

            if (typeof pos === "object") {
                x = pos.x
                y = pos.y
            } else {
                switch (pos) {
                    case "top":
                        x = "50%"
                        y = "0%"
                        break
                    case "bottom":
                        x = "50%"
                        y = "100%"
                        break
                    case "left":
                        x = "0%"
                        y = "50%"
                        break
                    case "right":
                        x = "100%"
                        y = "50%"
                        break
                    case "top-left":
                        x = "0%"
                        y = "0%"
                        break
                    case "top-right":
                        x = "100%"
                        y = "0%"
                        break
                    case "bottom-left":
                        x = "0%"
                        y = "100%"
                        break
                    case "bottom-right":
                        x = "100%"
                        y = "100%"
                        break
                }
            }

            el.style.setProperty("--glow-x", x)
            el.style.setProperty("--glow-y", y)
        }

        setPosition(position)

        // инжект CSS (один раз)
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style")
            style.id = STYLE_ID
            style.textContent = `
                [data-glow-id]::before {
                    content: "";
                    position: absolute;
                    width: var(--glow-size);
                    height: var(--glow-size);
                    left: var(--glow-x);
                    top: var(--glow-y);
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    border-radius: 50%;
                    opacity: var(--glow-opacity);
                    z-index: 1;
                    background: radial-gradient(
                        circle,
                        var(--glow-color) 25%,
                        var(--glow-color) 50%,
                        var(--glow-color) 75%,
                        transparent 100%
                    );
                    filter: blur(var(--glow-blur));
                    will-change: transform, opacity;
                }
            `
            document.head.appendChild(style)
        }
    },

    updated(el, binding) {
        if (!binding.value) return

        if (binding.value.position) {
            const pos = binding.value.position
            if (typeof pos === "object") {
                el.style.setProperty("--glow-x", pos.x)
                el.style.setProperty("--glow-y", pos.y)
            }
        }
    },

    unmounted(el) {
        delete el.dataset.glowId
    },
}

export default glowDirective
