<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import type { EditorLoadEvent } from "primevue/editor"
import PrimeEditor from "primevue/editor"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import { defaultMaxLength, defaultMaxRows } from "@c/common/b-textarea/definitions/textarea"
import { $sanitizeEditorHtml } from "@/lib/sanitize-html"

const model = defineModel<string>({ default: "" })

const props = withDefaults(defineProps<{
    placeholder?:     string
    disabled?:        boolean
    error?:           string
    hideCount?:       boolean
    maxlength?:       string | number
    hint?:            string | string[]
    rows?:            number
    sanitizeOnPaste?: boolean
}>(), {
    placeholder:     "",
    disabled:        false,
    error:           "",
    hideCount:       false,
    maxlength:       defaultMaxLength,
    hint:            undefined,
    rows:            defaultMaxRows,
    sanitizeOnPaste: true,
})

const { t } = useI18n()

const hint = computed(() => {
    if (!props.hint) return []
    if (Array.isArray(props.hint)) return props.hint
    return [props.hint]
})

const count = computed(() => model.value.length || 0)

const editorStyle = computed(() => `height: ${props.rows * 24 + 16}px`)

function onEditorLoad({ instance }: EditorLoadEvent) {
    if (!props.sanitizeOnPaste) return

    const quill = instance as any

    quill.root.addEventListener(
        "paste",
        (event: ClipboardEvent) => {
            const html = event.clipboardData?.getData("text/html")
            if (!html) return

            event.preventDefault()
            event.stopPropagation()

            const cleanHtml = $sanitizeEditorHtml(html)

            const range = quill.getSelection(true)
            if (!range) return

            if (range.length > 0) {
                quill.deleteText(range.index, range.length, "user")
            }

            quill.clipboard.dangerouslyPasteHTML(range.index, cleanHtml, "user")
        },
        true,
    )
}
</script>

<template>
    <div
        class="b-editor"
        :class="{
            'b-editor-disabled': props.disabled
        }"
    >
        <prime-editor
            v-model="model"
            :placeholder="props.placeholder"
            :readonly="props.disabled"
            :invalid="!!props.error"
            :editor-style="editorStyle"
            @load="onEditorLoad"
        >
            <template v-slot:toolbar>
                <span class="ql-formats">
                    <prime-button
                        class="ql-bold"
                        :disabled="props.disabled"
                        :unselectable="props.disabled ? 'off': 'on'"
                    />
                    <prime-button
                        class="ql-italic"
                        :disabled="props.disabled"
                    />
                    <prime-button
                        class="ql-underline"
                        :disabled="props.disabled"
                    />
                    <prime-button
                        class="ql-strike"
                        :disabled="props.disabled"
                    />
                    <prime-button
                        class="ql-list"
                        value="ordered"
                        :disabled="props.disabled"
                    />
                    <prime-button
                        class="ql-list"
                        value="bullet"
                        :disabled="props.disabled"
                    />
                </span>
            </template>
        </prime-editor>

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

    :deep(.p-editor) {
        .ql-formats {
            .p-button:not(:disabled) {
                border-color: var(--p-editor-toolbar-item-border-color);

                &:hover {
                    color: var(--p-editor-toolbar-item-hover-color);
                    background-color: var(--p-editor-toolbar-item-hover-background);
                    border-color: var(--p-editor-toolbar-item-hover-border-color);
                }
            }
        }

        ol, ul {
            padding-inline-start: 0;
        }
    }

    &.b-editor-disabled {
        --p-editor-toolbar-item-hover-color:        var(--p-editor-disabled-color);
        --p-editor-toolbar-item-hover-background:   var(--p-editor-disabled-background);
        --p-editor-toolbar-item-hover-border-color: var(--p-editor-disabled-background);

        :deep(.p-editor) {
            .p-editor-toolbar {
                background: var(--p-editor-disabled-background);
                color: var(--p-editor-disabled-color);
            }

            .p-editor-content {
                background: var(--p-editor-disabled-background);
                color: var(--p-editor-disabled-color);

                .ql-editor {
                    background: var(--p-editor-disabled-background);
                    color: var(--p-editor-disabled-color);
                }
            }

            .ql-formats {
                .p-button {
                    background: var(--p-editor-disabled-background);
                    color: var(--p-editor-disabled-color);
                    cursor: default;
                }
            }
        }
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
