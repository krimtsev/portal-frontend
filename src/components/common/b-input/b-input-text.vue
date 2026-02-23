<script setup lang="ts">
import PrimeInputText from "primevue/inputtext"
import BInputError from "@c/common/b-input/b-input-error.vue"

const emit = defineEmits(["change"])

const model = defineModel<string>()

const props = withDefaults(defineProps<{
    name?:        string,
    placeholder?: string
    disabled?:    boolean
    error?:       string
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
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
