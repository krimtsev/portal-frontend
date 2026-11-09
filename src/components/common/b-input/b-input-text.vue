<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
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
    invalid?:     boolean
    hideCount?:   boolean
    hint?:        string | string[]
}>(), {
    name:        undefined,
    placeholder: "",
    disabled:    false,
    error:       "",
    maxlength:   undefined,
    invalid:     false,
    hideCount:   true,
    hint:        undefined,
})

const { t } = useI18n()

const isInvalid = computed((): boolean => !!props.error || props.invalid)

const hint = computed(() => {
    if (!props.hint) return []
    if (Array.isArray(props.hint)) return props.hint
    return [props.hint]
})

const count = computed(() => model.value.length || 0)
</script>

<template>
    <div class="b-input-text">
        <prime-input-text
            v-model="model"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :name="props.name"
            :invalid="isInvalid"
            :maxlength="props.maxlength"
            type="text"
            class="input"
            @change="emit('change', model)"
        />

        <div
            v-if="!hideCount"
            class="count"
            :class="{ 'error': !!props.error }"
        >
            {{ t('mc.common.textArea.value', [count, maxlength]) }}
        </div>

        <b-input-error :error="props.error" />

        <div
            v-if="hint.length"
            class="hint"
        >
            <p
                v-for="(text, index) in hint"
                :key="index"
            >
                {{ text }}
            </p>
        </div>
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

    .count {
        @include small-text;

        padding-right: $indent-x1;
        color: var(--p-textarea-label-color);
    }

    .count + .hint {
        padding-top: 0;
    }

    .hint {
        padding-top: $indent-x1;
        color: var(--p-surface-500);
    }

    .error {
        color: var(--p-message-error-simple-color);
    }
}
</style>
