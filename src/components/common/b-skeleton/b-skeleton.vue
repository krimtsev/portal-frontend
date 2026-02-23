<script setup lang="ts">
import { computed } from "vue"
import PrimeSkeleton, { type SkeletonProps } from "primevue/skeleton"
import type { Variants } from "@/shared/content/content"

interface ISkeletonProps extends SkeletonProps {
    variant?: Variants
    invert?: boolean
    isLoading?: boolean
}

const props = withDefaults(defineProps<ISkeletonProps>(), {
    height: "1.15rem",
    variant: undefined,
    width: "20rem",
    invert: false,
    isLoading: true,
})

const variantClass = computed(() => props.variant ? `variant-${props.variant}` : "")
</script>

<template>
    <prime-skeleton
        v-if="props.isLoading"
        v-bind="props"
        :width="props.width"
        class="b-skeleton"
        :class="[
            variantClass,
            {
                'invert': props.invert
            }
        ]"
    />
    <slot v-else />
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

    &.invert {
        background: var(--p-skeleton-invert-background);
    }
}
</style>
