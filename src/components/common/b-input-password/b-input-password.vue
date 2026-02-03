<script setup lang="ts">
import { computed, useAttrs } from "vue"
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
    hint?: string
    fullWidth?: boolean,
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

const attrs = useAttrs()
</script>

<template>
    <div
        class="b-input-password"
        :class="{
            'full-width': props.fullWidth
        }"
    >
        <label
            v-if="label"
            :for="props.name"
            class="label"
        >
            {{ label }}
        </label>

        <prime-password
            v-model="model"
            v-bind="attrs"
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

        <div
            v-if="props.hint"
            class="hint"
        >
            {{ props.hint }}
        </div>
    </div>
</template>

<style scoped lang="scss">
$icon-size: calc(var(--p-icon-size) * 1.2);

.b-input-password {
    display: flex;
    flex-direction: column;
    width: 296px;

    &.full-width {
        width: 100%;
    }

    .label {
        margin-bottom: $indent;
    }

    .hint {
        @include small-text();

        padding-top: $indent-x1;
        color: var(--p-surface-400);
    }

    :deep(.p-password-input) {
        width: 100%;

        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
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
