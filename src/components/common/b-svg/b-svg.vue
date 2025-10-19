<script setup lang="ts">
import { computed } from "vue"
import { svgSrc } from "@h/svg/svg"

const props = defineProps<{ name: string }>()

const svg = computed(() => {
    return svgSrc(props.name)
})
</script>

<template>
    <span
        v-html="svg"
        class="b-svg"
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
