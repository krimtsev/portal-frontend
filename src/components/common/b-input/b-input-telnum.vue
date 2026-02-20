<script setup lang="ts">
import { ref, watch } from "vue"
import PrimeInputMask from "primevue/inputmask"
import BInputError from "@c/common/b-input/b-input-error.vue"

const emit = defineEmits(["change"])

const props = withDefaults(defineProps<{
    placeholder?: string
    name?:        string
    disabled?:    boolean
    error?:       string
}>(), {
    placeholder: "",
    error:       "",
    disabled:    false,
})

const maskedValue = ref("")

const model = defineModel<string>()

watch(maskedValue, (val) => {
    const digitsOnly = val.replace(/\D/g, "")
    model.value = digitsOnly
    emit("change", digitsOnly)
})
</script>

<template>
    <div class="b-input-telnum">
        <prime-input-mask
            v-model="maskedValue"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :name="props.name"
            :auto-clear="false"
            mask="+7 (999) 999-99-99"
            @change="emit('change', model)"
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
