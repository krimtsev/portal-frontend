<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import PrimeProgressBar from "primevue/progressbar"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import BSvg from "@c/common/b-svg/b-svg.vue"
import {
    bytesToMegabytes,
    DEFAULT_ACCEPT,
    DEFAULT_FILES_LIMIT,
    DEFAULT_MAX_SIZE_MB,
    megabytesToBytes,
} from "@c/common/b-upload-file/utils/b-file-upload"
import i18n from "@/plugins/i18n"

const model = defineModel<File | File[] | null>()

const emit = defineEmits<{
    (e: "upload"): void
    (e: "clear"): void
}>()

const props = withDefaults(defineProps<{
    accept?:       string
    multiple?:     boolean
    maxFileSize?:  number
    name?:         string
    error?:        string
    disabled?:     boolean
    isProcessing?: boolean
    placeholder?:  string
    showActions?:  boolean
    limit?:        number
}>(), {
    accept:      DEFAULT_ACCEPT,
    multiple:    true,
    maxFileSize: megabytesToBytes(DEFAULT_MAX_SIZE_MB),
    name:        "files[]",
    disabled:    false,
    placeholder: i18n.global.t("mc.common.fileUpload.placeholder"),
    error:       "",
    showActions: false,
    limit:       DEFAULT_FILES_LIMIT,
})

const { t } = useI18n()

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef")

const localError = ref<string | null>(null)

const isDisabled = computed(() => props.disabled || props.isProcessing)
const maxFileSizeMB = computed(() => bytesToMegabytes(props.maxFileSize))

const files = computed(() => {
    if (model.value) {
        if (Array.isArray(model.value)) {
            return model.value
        } else {
            return [model.value]
        }
    }
    return []
})
const hasFiles = computed(() => {
    return !!files.value.length
})

const validateFiles = (files: File[]): string | null => {
    if (props.accept) {
        const acceptedTypes = props.accept.split(",").map(t => t.trim().toLowerCase())

        for (const file of files) {
            const fileName = file.name.toLowerCase()
            const fileType = file.type.toLowerCase()

            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith(".")) {
                    return fileName.endsWith(type)
                }
                if (type.includes("*")) {
                    const regex = new RegExp(type.replace("*", ".*"))
                    return regex.test(fileType)
                }
                return fileType === type
            })

            if (!isAccepted) return t("mc.common.fileUpload.errors.type")
        }
    }

    if (props.limit && files.length > props.limit) {
        return t("mc.common.fileUpload.errors.limit", { limit: props.limit })
    }

    for (const file of files) {
        if (props.maxFileSize && file.size > props.maxFileSize) {
            return t("mc.common.fileUpload.errors.size", { size: maxFileSizeMB })
        }
    }

    return null
}

const onFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files?.length) return

    const selectedFiles = Array.from(target.files)

    const error = validateFiles(selectedFiles)

    if (error) {
        localError.value = error
        target.value = ""
        return
    }

    localError.value = null

    if (props.multiple) {
        const currentFiles = Array.isArray(model.value) ? model.value : []
        const combinedFiles = [...currentFiles, ...selectedFiles]

        if (props.limit && combinedFiles.length > props.limit) {
            localError.value = t("mc.common.fileUpload.errors.limit", { limit: props.limit })
            target.value = ""
            return
        }

        model.value = combinedFiles
    } else {
        model.value = selectedFiles[0]
    }

    target.value = ""
}

const removeFile = (index: number) => {
    if (isDisabled.value || !hasFiles.value) return

    if (Array.isArray(model.value)) {
        const newFiles = [...model.value]
        newFiles.splice(index, 1)
        model.value = newFiles.length ? newFiles : []
    } else {
        model.value = null
    }
}

const triggerPicker = () => {
    if (!props.disabled) fileInputRef.value?.click()
}

const onUpload = () => {
    emit("upload")
}

const onClear = () => {
    emit("clear")
    clear()
}

watch(model, (newVal) => {
    const isEmpty = !newVal || (Array.isArray(newVal) && newVal.length === 0)
    if (isEmpty) {
        localError.value = null
        if (fileInputRef.value) fileInputRef.value.value = ""
    }
}, { deep: true })

const clear = () => {
    model.value = props.multiple ? [] : null
    localError.value = null
}

defineExpose({ clear })
</script>

<template>
    <div
        class="b-file-upload"
        :class="{ 'disabled': isDisabled }"
    >
        <input
            ref="fileInputRef"
            type="file"
            class="hidden-input"
            :multiple="props.multiple"
            :accept="props.accept"
            :disabled="props.disabled"
            :name="props.name"
            @change="onFileSelect"
        >

        <div
            v-if="showActions"
            class="actions"
        >
            <div class="buttons">
                <prime-button
                    icon="pi pi-cloud-upload"
                    variant="outlined"
                    :severity="!hasFiles ? 'secondary' : ''"
                    :label="t('mc.common.fileUpload.buttons.upload')"
                    :disabled="isDisabled || !hasFiles"
                    @click="onUpload"
                />
                <prime-button
                    icon="pi pi-times"
                    variant="outlined"
                    severity="secondary"
                    :label="t('mc.common.fileUpload.buttons.cancel')"
                    :disabled="isDisabled || !hasFiles"
                    @click="onClear"
                />
            </div>

            <prime-progress-bar
                :mode="props.isProcessing ? 'indeterminate' : 'determinate'"
                class="progress"
            />
        </div>

        <div
            class="drop-box"
            :class="{ 'disabled': isDisabled }"
            @click="triggerPicker"
        >
            <div class="icon-wrapper">
                <b-svg
                    name="pi-cloud-upload"
                    class="icon"
                />
            </div>

            <div class="description">{{ props.placeholder }}</div>
        </div>

        <div
            v-if="hasFiles"
            class="files"
        >
            <div class="file-label">
                {{ t('mc.common.fileUpload.label') }}
            </div>

            <div class="file-list">
                <div
                    v-for="(file, index) in files"
                    :key="file.name + index"
                >
                    <div
                        class="file-item"
                        :class="{
                            'file-item-disabled': isDisabled
                        }"
                        @click.stop="removeFile(index)"
                    >
                        <span class="file-name">
                            {{ file.name }}
                        </span>
                        <b-svg
                            name="pi-times"
                            class="remove-icon"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="localError || props.error"
            class="error-wrapper"
        >
            <b-input-error v-if="localError" :error="localError" />
            <b-input-error v-else-if="props.error" :error="props.error" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.b-file-upload {
    .hidden-input {
        display: none;
    }

    display: flex;
    flex-direction: column;
    gap: $indent-x1;

    .actions {
        width: 100%;

        .buttons {
            display: flex;
            gap: $indent-x1;
        }

        .progress {
            height: 8px;
            width: 100%;
            margin-top: $indent-x1;
        }
    }

    .drop-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $indent-x1;
        border: 1px dashed var(--p-content-border-color);
        border-radius: var(--p-form-field-border-radius);
        padding: $indent-x2;
        min-height: 160px;
        cursor: pointer;

        .icon-wrapper {
            .icon {
                font-size: 3rem;
                color: var(--p-surface-500);
            }
        }

        .description {
            color: var(--p-surface-500);
        }

        &.disabled {
            background: var(--p-form-field-disabled-background);
            cursor: default;
        }
    }

    .files {
        display: flex;
        flex-wrap: wrap;
        gap: $indent-x1;

        .file-label {
            color: var(--p-surface-400);
        }

        .file-list {
            display: flex;
            flex-wrap: wrap;
            gap: $indent-x1;
            color: var(--p-surface-400);

            .file-item {
                display: flex;
                align-items: end;
                gap: $indent-x1;
                cursor: pointer;

                .remove-icon {
                    font-size: 0.8rem;
                    line-height: 1rem;
                    color: var(--p-surface-400);
                }

                &:hover:not(.file-item-disabled) {
                    color: var(--p-surface-300);

                    .remove-icon {
                        color: var(--p-red-500);
                    }
                }

                &-disabled {
                    cursor: default;

                    &:hover {
                        color: inherit;
                    }
                }
            }
        }
    }
}
</style>
