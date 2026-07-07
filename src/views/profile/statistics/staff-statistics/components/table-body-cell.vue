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
    return props.growth >= 0 ? "text-positive" : "text-negative"
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
        background: rgba(57, 72, 8, 1);
        background: radial-gradient(30em 6em at top, rgb(58, 72, 9), rgb(119, 135, 18, 0.9));
    }

    &.cell-bg-negative {
        background: rgba(48, 8, 8, 1);
        background: radial-gradient(30em 6em at top, rgba(48, 8, 8, 1.0), rgba(150, 25, 25, 0.5));
    }

    .growth {
        @include small-text;
        margin-top: -2rem;

        &.text-positive {
            color: rgba(178, 203, 30, 1);
        }

        &.text-negative {
            color: rgba(255, 98, 98, 1);
        }
    }
}
</style>
