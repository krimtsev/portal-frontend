<script setup lang="ts">
import PrimeButton from "primevue/button"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = defineProps<{
    label: string,
    disabled?: boolean
    loading?: boolean
}>()
</script>

<template>
    <prime-button
        :label="props.label"
        :disabled="props.disabled"
        :loading="props.loading"
        icon-pos="right"
        icon="pi pi-download"
        type="button"
        class="b-button-download"
        @click="emit('click')"
    />
</template>

<style scoped lang="scss">
.b-button-download {
    white-space: nowrap;
    min-width: 104px;
}
</style>
