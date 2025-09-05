<script setup lang="ts">
import PrimeDivider, { type DividerProps } from "primevue/divider"

const props = defineProps<DividerProps>()
</script>

<template>
    <prime-divider
        class="b-divider"
        v-bind="props"
    />
</template>

<style scoped lang="scss">
.b-divider {
    border-block-start: 1px solid var(--p-divider-border-color);
}
</style>
