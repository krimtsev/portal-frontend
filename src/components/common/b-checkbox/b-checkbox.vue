<script setup lang="ts">
import PrimeCheckbox from "primevue/checkbox"

const model = defineModel<boolean>()

const props = withDefaults(defineProps<{
    name: string,
    label?: string,
    binary?: boolean
    disabled?: boolean
}>(), {
    binary: true
})
</script>

<template>
    <div class="b-checkbox">
        <prime-checkbox
            v-model="model"
            :name="props.name"
            :binary="props.binary"
            :input-id="props.name"
            :disabled="props.disabled"
            class="checkbox"
        />
        <label
            v-if="props.label"
            :for="props.name"
            class="label"
        >
            {{ props.label }}
        </label>
    </div>
</template>

<style scoped lang="scss">
.b-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;

    .label {
        margin-left: $indent;
    }
}
</style>
