<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PrimeEditor from "primevue/editor"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import { defaultMaxLength } from "@c/common/b-textarea/definitions/textarea.ts"

const model = defineModel<string>({ default: "" })

const props = withDefaults(defineProps<{
    placeholder?: string
    disabled?:    boolean
    error?:       string
    hideCount?:   boolean
    maxlength?:   string | number
    hint?:        string | string[]
}>(), {
    placeholder: "",
    disabled:    false,
    error:       "",
    hideCount:   false,
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
    <div class="b-editor">
        <prime-editor
            v-model="model"
            :placeholder="props.placeholder"
            :readonly="props.disabled"
            :invalid="!!props.error"
            editor-style="height: 160px"
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
.b-editor {
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    .count {
        @include small-text;

        padding-right: $indent-x1;
        color: var(--p-surface-500);
    }

    :deep(.p-editor)  {
        &.p-invalid {
            .p-editor-toolbar {
                border-color: var(--p-form-field-invalid-border-color);
            }

            .p-editor-content {
                border-color: var(--p-form-field-invalid-border-color);
            }
        }
    }
}
</style>
