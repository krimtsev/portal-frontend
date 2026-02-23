<script setup lang="ts">
import { useAttrs } from "vue"
import PrimePassword from "primevue/password"
import BInputError from "@c/common/b-input/b-input-error.vue"

const model = defineModel<string>()

const props = withDefaults(defineProps<{
    name?:        string,
    toggleMask?:  boolean
    placeholder?: string
    disabled?:    boolean
    hint?:        string
    error?:       string
    feedback?:    boolean
}>(), {
    toggleMask:  true,
    placeholder: "",
    error:       "",
    feedback:    false,
    disabled:    false
})

const attrs = useAttrs()
</script>

<template>
    <div class="b-input-password">
        <prime-password
            v-model="model"
            v-bind="attrs"
            :name="props.name"
            :toggle-mask="props.toggleMask"
            :placeholder="props.placeholder"
            :feedback="props.feedback"
            :disabled="props.disabled"
            :invalid="!!props.error"
            class="password"
        />

        <b-input-error :error="props.error" />

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
    width: $input-width;

    &.full-width {
        width: 100%;
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

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }
}
</style>
