<script setup lang="ts">
import PrimeBlockUi from "primevue/blockui"

const props = withDefaults(defineProps<{
    blocked: boolean,
}>(), {
    blocked: false,
})

</script>

<template>
    <prime-block-ui :blocked="props.blocked">
        <slot />
    </prime-block-ui>
</template>
