<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, useTemplateRef } from "vue"

const props = withDefaults(defineProps<{
    text:       string | number
    subtext?:   string
    showEmpty?: boolean
}>(), {
    text:      "",
    showEmpty: false,
    subtext:   undefined,
})

const textElementRef = useTemplateRef<HTMLElement | null>("textElementRef")
const isTruncated = ref(false)

const textOrDash = computed(() => {
    if (props.text) return props.text
    return props.showEmpty ? "" : "—"
})

const checkOverflow = () => {
    const el = textElementRef.value
    if (el) {
        isTruncated.value = el.scrollWidth > el.clientWidth
    }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
    checkOverflow()
    if (textElementRef.value) {
        resizeObserver = new ResizeObserver(checkOverflow)
        resizeObserver.observe(textElementRef.value)
    }
})

onUnmounted(() => {
    resizeObserver?.disconnect()
})

const tooltipValue = computed(() => {
    return isTruncated.value ? props.text : ""
})
</script>

<template>
    <div class="b-table-text">
        <span
            ref="textElementRef"
            v-tooltip="tooltipValue"
            class="text"
        >
            <slot name="default">{{ textOrDash }}</slot>
        </span>

        <div
            v-if="subtext"
            class="subtext"
        >
            {{ subtext }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-table-text {
    display: flex;
    flex-direction: column;
    max-width: 100%;

    .text {
        @include text-overflow;

        display: block;
        width: 100%;
    }

    .subtext {
        @include text-overflow;

        color: var(--p-surface-500);
        display: block;
        width: 100%;
    }
}
</style>
