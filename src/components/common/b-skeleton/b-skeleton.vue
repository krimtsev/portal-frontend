<script setup lang="ts">
import PrimeSkeleton, { type SkeletonProps } from "primevue/skeleton"

const props = withDefaults(defineProps<SkeletonProps>(), {
    height: "1.15rem"
})
</script>

<template>
    <prime-skeleton
        class="b-skeleton"
        v-bind="props"
    />
</template>
