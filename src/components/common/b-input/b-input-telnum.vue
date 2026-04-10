<script setup lang="ts">
import { ref, watch } from "vue"
import PrimeInputMask from "primevue/inputmask"
import BInputError from "@c/common/b-input-error/b-input-error.vue"

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
    (e: "change", value: string): void
}>()

const props = withDefaults(defineProps<{
    name?:        string
    placeholder?: string
    error?:       string
    disabled?:    boolean
}>(), {
    name:        undefined,
    placeholder: "",
    error:       "",
    disabled:    false,
})

const maskedValue = ref("")

const toDigit = (val?: string) => {
    return val ? String(val).replace(/\D/g, "") : ""
}

watch(maskedValue, (val) => {
    const digitsOnly = toDigit(val)
    model.value = digitsOnly
    emit("change", digitsOnly)
})

watch(model, (newVal) => {
    const cleanNewVal = toDigit(newVal)
    const cleanCurrent = toDigit(maskedValue.value)

    if (cleanNewVal !== cleanCurrent) {
        maskedValue.value = cleanNewVal
    }
}, { immediate: true })

const onInput = (event: any) => {
    const rawValue = event.target.value
    const digitsOnly = toDigit(rawValue)

    if (model.value !== digitsOnly) {
        model.value = digitsOnly
        emit("change", digitsOnly)
    }
}
</script>

<template>
    <div class="b-input-telnum">
        <prime-input-mask
            v-model="maskedValue"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :name="props.name"
            :auto-clear="false"
            :invalid="!!props.error"
            mask="+7 (999) 999-99-99"
            @input="onInput"
        />

        <b-input-error :error="props.error" />
    </div>
</template>

<style scoped lang="scss">
.b-input-telnum {
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
