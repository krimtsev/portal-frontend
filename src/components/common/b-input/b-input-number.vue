<script setup lang="ts">
import PrimeInputNumber from "primevue/inputnumber"
import BInputError from "@c/common/b-input/b-input-error.vue"

const model = defineModel<number|null>()

const props = withDefaults(defineProps<{
    name?:        string,
    placeholder?: string
    disabled?:    boolean
    error?:       string
    grouping?:    boolean
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    grouping:    false
})

</script>

<template>
    <div class="b-input-number">
        <prime-input-number
            v-model="model"
            :name="props.name"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :use-grouping="props.grouping"
            class="input"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-input-number {
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
