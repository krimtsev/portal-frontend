<script setup lang="ts">
import PrimeAccordionContent from "primevue/accordioncontent"
</script>

<template>
    <prime-accordion-content class="portal-accordion-content">
        <slot />
    </prime-accordion-content>
</template>

<style scoped lang="scss">
.portal-accordion-content {}
</style>
