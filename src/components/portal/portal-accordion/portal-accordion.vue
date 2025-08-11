<script setup lang="ts">
import { useAttrs } from "vue"
import PrimeAccordion, { type AccordionProps } from "primevue/accordion"

const attrs = useAttrs()
const props = defineProps<AccordionProps>()
</script>

<template>
    <prime-accordion
        :multiple="props.multiple"
        v-bind="attrs"
        class="portal-accordion"
        expand-icon="pi pi-plus"
        collapse-icon="pi pi-times"
    >
        <slot />
    </prime-accordion>
</template>
