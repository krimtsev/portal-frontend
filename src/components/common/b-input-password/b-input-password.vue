<script setup lang="ts">
import { computed } from "vue"
import PrimePassword from "primevue/password"
import PrimeMessage from "primevue/message"

const model = defineModel<string>()

const props = withDefaults(defineProps<{
    name: string,
    label?: string,
    labelColon?: boolean,
    error?: string
    toggleMask?: boolean
    feedback?: boolean
    placeholder: string
    disabled?: boolean
}>(), {
    toggleMask: true,
    feedback: false,
    labelColon: false,
    placeholder: "",
})

const label = computed(() => {
    if (!props.label) return ""
    if (props.labelColon) return `${props.label}:`
    return props.label
})
</script>

<template>
    <div class="b-input-password">
        <label
            v-if="label"
            :for="props.name"
            class="label"
        >
            {{ label }}
        </label>

        <prime-password
            v-model="model"
            :name="props.name"
            :toggle-mask="props.toggleMask"
            :feedback="props.feedback"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            class="password"
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
$icon-size: calc(var(--p-icon-size) * 1.2);

.b-input-password {
    display: flex;
    flex-direction: column;

    .label {
        margin-bottom: $indent;
    }

    :deep(.p-password-input) {
        width: 100%;

        &.p-invalid {
            border-color: var(--p-inputtext-invalid-border-color);
        }
    }

    :deep(.p-password-toggle-mask-icon) {
        width: $icon-size;
        height: $icon-size;
        margin-top: calc(-1 * calc($icon-size / 2));
        cursor: pointer;
    }

    .error {
        margin-top: $indent;
    }
}
</style>
