<script setup lang="ts">
import { computed } from "vue"
import { svgSrc } from "@h/svg/svg"

/**
 * svg - пытаемся найти кастомную иконку
 * если ее нет, подставляем как класс иконку из набора prime
 */

const props = defineProps<{
    name?: string
    size?: string
}>()

const svg = computed(() => {
    return svgSrc(props.name)
})
</script>

<template>
    <span
        v-if="svg"
        v-html="svg"
        class="b-svg"
    />
    <span
        v-else
        class="b-svg pi"
        :class="props.name"
        :style="{ fontSize: props.size }"
    />
</template>

<style scoped lang="scss">
.b-svg {
    color: var(--p-surface-700);

    svg {
        fill: currentColor;
    }
}
</style>
