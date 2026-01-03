<script setup lang="ts">
import PrimeInputNumber from "primevue/inputnumber"
import PrimeMessage from "primevue/message"

interface InputNumber {
    name: string
    label: string
    error: string
    fullWidth: boolean
    placeholder: string
    disabled: boolean
    grouping: boolean
}

const props =  defineProps<Partial<InputNumber>>()

const model = defineModel<number|null>()
</script>

<template>
    <div class="b-input-number">
        <label
            v-if="props.label"
            :for="props.name"
            class="label"
        >
            {{ props.label }}
        </label>

        <prime-input-number
            v-model="model"
            :name="props.name"
            :placeholder="props.placeholder"
            :fluid="props.fullWidth"
            :disabled="props.disabled"
            :use-grouping="props.grouping"
            class="textarea"
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
.b-input-number {
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
