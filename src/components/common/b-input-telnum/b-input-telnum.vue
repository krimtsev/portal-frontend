<script setup lang="ts">
import { computed, ref, watch } from "vue"
import PrimeInputMask from "primevue/inputmask"
import PrimeMessage from "primevue/message"

const emit = defineEmits(["change"])

const props = withDefaults(defineProps<{
    placeholder?: string
    label?: string,
    labelColon?: boolean
    name?: string
    disabled?: boolean
    error?: string
}>(), {
    placeholder: "",
    labelColon: false,
})

const maskedValue = ref("")

const model = defineModel<string>()

watch(maskedValue, (val) => {
    const digitsOnly = val.replace(/\D/g, "")
    model.value = digitsOnly
    emit("change", digitsOnly)
})

const label = computed(() => {
    if (!props.label) return ""
    if (props.labelColon) return `${props.label}:`
    return props.label
})
</script>

<template>
    <div class="b-input-telnum">
        <label
            v-if="label"
            :for="props.name"
            class="label"
        >
            {{ label }}
        </label>

        <prime-input-mask
            v-model="maskedValue"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :name="props.name"
            :auto-clear="false"
            mask="+7 (999) 999-99-99"
            @change="emit('change', model)"
        />

        <prime-message
            v-if="props.error"
            severity="error"
            size="small"
            variant="simple"
            class="error"
        >
            {{ props.error }}
        </prime-message>
    </div>
</template>

<style scoped lang="scss">
.b-input-telnum {
    display: flex;
    flex-direction: column;

    :deep(.p-inputtext)  {
        &.p-invalid {
            border-color: var(--p-inputtext-invalid-border-color);
        }
    }

    .label {
        margin-bottom: $indent-x1;
    }

    .error {
        margin-top: $indent-x1;
    }
}
</style>
