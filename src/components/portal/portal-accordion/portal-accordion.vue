<script setup lang="ts">
import Accordion from "primevue/accordion"
</script>

<template>
    <Accordion
        class="portal-accordion"
        expandIcon="pi pi-plus" collapseIcon="pi pi-times"
    >
        <slot />
    </Accordion>
</template>
