<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PrimeTextarea from "primevue/textarea"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import {
    defaultMaxCols,
    defaultMaxLength,
    defaultMaxRows,
} from "@c/common/b-textarea/definitions/textarea"

const model = defineModel<string>({ default: "" })

const props = withDefaults(defineProps<{
    name?:        string
    placeholder?: string
    disabled?:    boolean
    error?:       string
    rows?:        number | string
    cols?:        number | string
    hint?:        string | string[]
    hideCount?:   boolean
    maxlength?:   string | number
    label?:       string
}>(), {
    name:        undefined,
    label:       "",
    placeholder: "",
    disabled:    false,
    error:       "",
    rows:        defaultMaxRows,
    cols:        defaultMaxCols,
    maxlength:   defaultMaxLength,
    hint:        undefined,
})

const { t } = useI18n()

const hint = computed(() => {
    if (!props.hint) return []
    if (Array.isArray(props.hint)) return props.hint
    return [props.hint]
})

const count = computed(() => model.value.length || 0)
</script>

<template>
    <div class="b-textarea">
        <div
            v-if="props.label.length"
            class="label"
        >
            {{ props.label }}
        </div>

        <prime-textarea
            v-model="model"
            :name="name"
            :rows="props.rows"
            :cols="props.cols"
            :placeholder="props.placeholder"
            :invalid="!!props.error"
            :disabled="props.disabled"
            :maxlength="-1"
            style="resize: none"
            class="textarea"
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
.b-textarea {
    display: flex;
    flex-direction: column;
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    :deep(.p-textarea)  {
        &.p-invalid {
            border-color: var(--p-form-field-invalid-border-color);
        }
    }

    .b-input-error {
        margin-top: calc($indent-x1 / 2);
    }

    .label {
        color: var(--p-surface-500);
        padding-bottom: $indent-x1;
    }

    .count {
        @include small-text;

        padding-right: $indent-x1;
        color: var(--p-surface-500);
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
