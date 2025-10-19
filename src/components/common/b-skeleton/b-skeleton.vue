<script setup lang="ts">
import { computed } from "vue"
import PrimeSkeleton, { type SkeletonProps } from "primevue/skeleton"
import type { Variants } from "@/shared/content/content"

interface ISkeletonProps extends SkeletonProps {
    variant?: Variants
}

const props = withDefaults(defineProps<ISkeletonProps>(), {
    height: "1.15rem",
    variant: undefined,
    width: "20rem",
})

const variantClass = computed(() => props.variant ? `variant-${props.variant}` : "")
</script>

<template>
    <prime-skeleton
        class="b-skeleton"
        v-bind="props"
        :width="props.width"
        :class="variantClass"
    />
</template>

<style scoped lang="scss">
.b-skeleton {
    &.variant-sm {
        height: $line-height-h4 !important;
    }
    &.variant-md {
        height: $line-height-h3 !important;
    }
    &.variant-lg {
        height: $line-height-h2 !important;
    }
    &.variant-xl {
        height: $line-height-h1 !important;
    }
}
</style>
