<script setup lang="ts">
import { computed } from "vue"
import PrimeInputText from "primevue/inputtext"
import PrimeMessage from "primevue/message"

const model = defineModel<string>()

const emit = defineEmits(["change"])

const props = withDefaults(defineProps<{
    name: string,
    placeholder?: string
    label?: string,
    labelColon?: boolean
    error?: string
    disabled?: boolean
}>(), {
    placeholder: "",
    labelColon: false,
})

const label = computed(() => {
    if (!props.label) return ""
    if (props.labelColon) return `${props.label}:`
    return props.label
})
</script>

<template>
    <div class="b-input-text">
        <label
            v-if="label"
            :for="props.name"
            class="label"
        >
            {{ label }}
        </label>

        <prime-input-text
            v-model="model"
            :name="props.name"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            type="text"
            class="input"
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
.b-input-text {
    display: flex;
    flex-direction: column;

    :deep(.p-inputtext)  {
        &.p-invalid {
            border-color: var(--p-inputtext-invalid-border-color);
        }
    }

    .label {
        margin-bottom: $indent;
    }

    .error {
        margin-top: $indent;
    }
}
</style>
