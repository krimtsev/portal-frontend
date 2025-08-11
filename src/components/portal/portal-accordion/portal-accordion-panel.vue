<script setup lang="ts">
import { useAttrs } from "vue"
import PrimeAccordionPanel, { type AccordionPanelProps } from "primevue/accordionpanel"

const props = defineProps<AccordionPanelProps>()
const attrs = useAttrs()
</script>

<template>
    <prime-accordion-panel
        class="portal-accordion-panel"
        :value="props.value"
        v-bind="attrs"
    >
        <slot />
    </prime-accordion-panel>
</template>

<style scoped lang="scss">
.portal-accordion-panel {
    border-radius: $indent-x3;
    border: none;
    overflow: hidden;
}
</style>
