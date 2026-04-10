<script setup lang="ts">
import { computed } from "vue"
import { svgSrc } from "@h/svg/svg"

/**
 * svg - пытаемся найти кастомную иконку
 * если ее нет, подставляем как класс иконку из набора prime
 */

const props = defineProps<{
    name?:     string
    size?:     string
    disabled?: boolean
}>()

const svg = computed(() => {
    return svgSrc(props.name)
})

const commonStyle = computed(() => {
    if (!props.size) return {}
    return {
        fontSize: props.size,
    }
})
</script>

<template>
    <span
        v-if="svg"
        v-html="svg"
        class="b-svg"
        :class="{ 'is-disabled': props.disabled }"
        :style="commonStyle"
    />
    <span
        v-else
        class="b-svg pi"
        :class="[
            props.name,
            { 'is-disabled': props.disabled }
        ]"
        :style="commonStyle"
    />
</template>

<style scoped lang="scss">
.b-svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    vertical-align: middle;

    &.is-disabled {
        color: var(--p-surface-0);
        cursor: not-allowed;
        pointer-events: none;
    }

    :deep(svg) {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
        fill: currentColor;

        path {
            fill: currentColor;
        }
    }
}
</style>
