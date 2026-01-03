<script setup lang="ts">
import { computed } from "vue"

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

const props = withDefaults(defineProps<{
    position?: GlowPosition
    color?: string
    size?: number
    blur?: number
    opacity?: number
}>(), {
    position: "center",
    color: "rgba(255,255,255,0.9)",
    size: 150,
    blur: 100,
    opacity: 0.4,
})

const vars = computed(() => {
    let x = "50%"
    let y = "50%"

    if (typeof props.position === "object") {
        x = props.position.x
        y = props.position.y
    } else {
        const map: Record<string, [string, string]> = {
            top: ["50%", "0%"],
            bottom: ["50%", "100%"],
            left: ["0%", "50%"],
            right: ["100%", "50%"],
            "top-left": ["0%", "0%"],
            "top-right": ["100%", "0%"],
            "bottom-left": ["0%", "100%"],
            "bottom-right": ["100%", "100%"],
            center: ["50%", "50%"],
        }
        ;[x, y] = map[props.position]
    }

    return {
        "--glow-x": x,
        "--glow-y": y,
        "--glow-size": `${props.size}px`,
        "--glow-blur": `${props.blur}px`,
        "--glow-color": props.color,
        "--glow-opacity": props.opacity,
    }
})
</script>

<template>
    <div class="b-glow" :style="vars">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.b-glow {
    position: relative;
    overflow: visible;

    &::before {
        content: "";
        position: absolute;
        width: var(--glow-size);
        height: var(--glow-size);
        left: var(--glow-x);
        top: var(--glow-y);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        pointer-events: none;
        opacity: var(--glow-opacity);
        background: radial-gradient(
                circle,
                var(--glow-color) 25%,
                var(--glow-color) 50%,
                var(--glow-color) 75%,
                transparent 100%
        );
        filter: blur(var(--glow-blur));
    }
}
</style>
