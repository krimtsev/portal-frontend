<script setup lang="ts">
import PrimeInputText from "primevue/inputtext"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<string>({ default: undefined })

const emit = defineEmits<{
    (e: "change", model: string): void
}>()

const props = withDefaults(defineProps<{
    name?:        string
    placeholder?: string
    disabled?:    boolean
    error?:       string
    maxlength?:   number
}>(), {
    name:        undefined,
    placeholder: "",
    disabled:    false,
    error:       "",
    maxlength:   undefined,
})
</script>

<template>
    <div class="b-input-text">
        <prime-input-text
            v-model="model"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :name="props.name"
            :invalid="!!props.error"
            :maxlength="props.maxlength"
            type="text"
            class="input"
            @change="emit('change', model)"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-input-text {
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
