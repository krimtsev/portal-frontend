<script setup lang="ts">
import PrimeButton from "primevue/button"

type ButtonType = "submit" | "reset" | "button"

const props = defineProps<{
    label: string,
    type?: ButtonType
    widthFull?: boolean
    disabled?: boolean
    loading?: boolean
}>()
</script>

<template>
    <div class="b-button">
        <prime-button
            :label="props.label"
            :type="props.type"
            :disabled="props.disabled"
            :loading="props.loading"
            class="button"
            :class="{
                'width-full': props.widthFull
            }"
        />
    </div>
</template>

<style scoped lang="scss">
.b-button {
    .button {
        min-width: 104px;

        &.width-full {
            width: 100%;
        }
    }
}
</style>
