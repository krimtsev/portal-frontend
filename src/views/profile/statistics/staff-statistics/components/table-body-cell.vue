<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    growth?:    number
    highlight?: boolean
}>()

const growthValue = computed(() => {
    if (props.growth === undefined || props.growth === null) return ""
    const sign = props.growth > 0 ? "+" : ""
    return `${sign}${props.growth}%`
})

const cellClasses = computed(() => {
    if (!props.highlight || props.growth === undefined || props.growth === null) return ""
    if (props.growth >= 10) return "cell-bg-positive"
    if (props.growth <= -10) return "cell-bg-negative"
    return ""
})

const textClasses = computed(() => {
    if (props.growth === undefined || props.growth === null) return ""
    return props.growth >= 0 ? "growth-positive" : "growth-negative"
})
</script>

<template>
    <div
        class="table-body-cell"
        :class="cellClasses"
    >
        <div class="cell-content">
            <slot />

            <span
                v-if="growthValue"
                class="growth"
                :class="textClasses"
            >
                {{ growthValue }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.table-body-cell {
    display: flex;
    align-items: center;
    height: 67px;

    .cell-content {
        display: flex;
        align-items: center;
        padding: var(--p-datatable-body-cell-padding);
        overflow: hidden;
    }

    &.cell-bg-positive {
        background: var(--p-statistics-cell-positive-background-solid);
        background: radial-gradient(30em 6em at top, var(--p-statistics-cell-positive-background-gradient-start), var(--p-statistics-cell-positive-background-gradient-end));
        color: var(--p-statistics-cell-positive-color);
    }

    &.cell-bg-negative {
        background: var(--p-statistics-cell-negative-background-solid);
        background: radial-gradient(30em 6em at top, var(--p-statistics-cell-negative-background-gradient-start), var(--p-statistics-cell-negative-background-gradient-end));
        color: var(--p-statistics-cell-negative-color);
    }

    .growth {
        @include small-text;

        margin-top: -2rem;

        &.growth-positive {
            color: var(--p-statistics-cell-positive-growth-color);
        }

        &.growth-negative {
            color: var(--p-statistics-cell-negative-growth-color);
        }
    }
}
</style>
