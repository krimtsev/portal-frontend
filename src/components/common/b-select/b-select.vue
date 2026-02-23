<script setup lang="ts">
import PrimeSelect from "primevue/select"
import BInputError from "@c/common/b-input/b-input-error.vue"

const model = defineModel<any>()

const props = withDefaults(defineProps<{
    options:      any[],
    placeholder?: string
    disabled?:    boolean
    error?:       string
    filter?:      boolean | undefined
    optionLabel?: string
    optionValue?: string
    isLoading?:   boolean
    showClear?:   boolean
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    optionLabel: "label",
    optionValue: "value",
    isLoading:   false,
    showClear:   false
})
</script>

<template>
    <div class="b-select">
        <prime-select
            v-model="model"
            :options="props.options"
            :disabled="props.disabled"
            :filter="props.filter"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :loading="props.isLoading"
            :show-clear="props.showClear"
            class="select"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-select {
    display: flex;
    flex-direction: column;
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    :deep(.p-inputtext)  {
        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
