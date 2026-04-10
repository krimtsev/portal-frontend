<script setup lang="ts">
import PrimeSelectButton from "primevue/selectbutton"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<any>()

const props = withDefaults(defineProps<{
    name?:        string
    disabled?:    boolean
    error?:       string
    options:      any[]
    optionLabel?: string
    optionValue?: string
    allowEmpty?:  boolean
}>(), {
    name:        undefined,
    disabled:    false,
    error:       "",
    allowEmpty:  false,
    optionLabel: undefined,
    optionValue: undefined,
})
</script>

<template>
    <div class="b-select-button">
        <prime-select-button
            v-model="model"
            :disabled="props.disabled"
            :options="props.options"
            :option-label="props.optionLabel"
            :option-value="props.optionValue"
            :allow-empty="props.allowEmpty"
            :name="props.name"
            :invalid="!!props.error"
            class="select-button"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-select-button {
    display: flex;
    flex-direction: column;
    //width: $input-width;

    &.full-width {
        width: 100%;
    }

    :deep(.p-selectbutton) {
        .p-togglebutton-checked .p-togglebutton-content {
            background: var(--p-primary-color);
            color: var(--p-primary-contrast-color);
        }

        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
