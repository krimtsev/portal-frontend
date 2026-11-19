<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue"
import { useI18n } from "vue-i18n"
import PrimeButton from "primevue/button"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import BSvg from "@c/common/b-svg/b-svg.vue"
import { bytesToMegabytes, megabytesToBytes } from "@/lib/format-size"
import { DEFAULT_IMAGE_MAX_SIZE_MB } from "@/constants/files"
import { IMAGE_ACCEPT } from "@/constants/mime-types"
import i18n from "@/plugins/i18n.ts"

const model = defineModel<File | null>()

const emit = defineEmits<{
    (e: "remove"): void
}>()

const props = withDefaults(defineProps<{
    serverUrl?:   string | null
    accept?:      string
    maxFileSize?: number
    disabled?:    boolean
    error?:       string
    placeholder?: string
}>(), {
    serverUrl:   null,
    accept:      IMAGE_ACCEPT,
    maxFileSize: megabytesToBytes(DEFAULT_IMAGE_MAX_SIZE_MB),
    disabled:    false,
    error:       "",
    placeholder: i18n.global.t("mc.common.imageUpload.placeholder"),
})

const { t } = useI18n()

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef")

const localError = ref<string | null>(null)
const dragCounter = ref(0)

const isDisabled = computed(() => props.disabled)
const isDragging = computed(() => dragCounter.value > 0)
const maxFileSizeMB = computed(() => bytesToMegabytes(props.maxFileSize))

// ----- object URL для локального превью выбранного файла -----
const localPreviewUrl = ref<string | null>(null)

watch(model, (file) => {
    if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value)
        localPreviewUrl.value = null
    }
    if (file instanceof File) {
        localPreviewUrl.value = URL.createObjectURL(file)
    }
}, { immediate: true })

onBeforeUnmount(() => {
    if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value)
    }
})

const displayUrl = computed<string | null>(() => {
    if (model.value) return localPreviewUrl.value
    return props.serverUrl
})
const hasImage = computed(() => !!displayUrl.value)

// ----- валидация -----
function validateFile(file: File): string | null {
    const acceptedTypes = props.accept.split(",")
        .map(type => type.trim().toLowerCase())
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith(".")) return fileName.endsWith(type)
        if (type.includes("*")) {
            const regex = new RegExp(type.replace("*", ".*"))
            return regex.test(fileType)
        }
        return fileType === type
    })

    if (!isAccepted) {
        return t("mc.common.fileUpload.errors.type")
    }
    if (props.maxFileSize && file.size > props.maxFileSize) {
        return t("mc.common.fileUpload.errors.size", { size: maxFileSizeMB.value })
    }
    return null
}

// ----- обработчики -----
function processFile(file: File) {
    const error = validateFile(file)
    if (error) {
        localError.value = error
        return
    }
    localError.value = null
    model.value = file
}

function onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    if (!target.files?.length) return
    processFile(target.files[0])
    target.value = ""
}

function onDragEnter(event: DragEvent) {
    if (isDisabled.value) return
    event.preventDefault()
    dragCounter.value++
}

function onDragOver(event: DragEvent) {
    if (isDisabled.value) return
    event.preventDefault()
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy"
    }
}

function onDragLeave(event: DragEvent) {
    if (isDisabled.value) return
    event.preventDefault()
    dragCounter.value = Math.max(0, dragCounter.value - 1)
}

function onDrop(event: DragEvent) {
    if (isDisabled.value) return
    event.preventDefault()
    dragCounter.value = 0

    const file = event.dataTransfer?.files?.[0]
    if (file) processFile(file)
}

function triggerPicker() {
    if (isDisabled.value) return
    fileInputRef.value?.click()
}

function onRemove() {
    if (isDisabled.value) return

    if (model.value) {
        model.value = null
    } else if (props.serverUrl) {
        emit("remove")
    }
}

function clear() {
    model.value = null
    localError.value = null
}

defineExpose({ clear })
</script>

<template>
    <div
        class="b-image-upload"
        :class="{
            'disabled': isDisabled,
            'drag-active': isDragging,
            'has-image': hasImage,
        }"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
    >
        <input
            ref="fileInputRef"
            type="file"
            class="hidden-input"
            :accept="props.accept"
            :disabled="isDisabled"
            @change="onFileSelect"
        >

        <!-- Превью: клик по картинке = заменить -->
        <div
            v-if="hasImage"
            class="preview"
            :class="{ 'preview-disabled': isDisabled }"
            @click="triggerPicker"
        >
            <img
                :src="displayUrl!"
                alt=""
                class="preview-image"
            >

            <div
                v-if="!isDisabled"
                class="preview-actions"
                @click.stop
            >
                <prime-button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    text
                    @click="onRemove"
                />
            </div>
        </div>

        <div
            v-else
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

            <div class="description">
                {{ props.placeholder || t("mc.common.imageUpload.placeholder") }}
            </div>
        </div>

        <div
            v-if="localError || props.error"
            class="error-wrapper"
        >
            <b-input-error
                v-if="localError"
                :error="localError"
            />

            <b-input-error
                v-else
                :error="props.error"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.b-image-upload {
    display: flex;
    flex-direction: column;
    gap: $indent-x1;
    width: $input-width;

    &.full-width {
        width: 100%;
    }

    .hidden-input {
        display: none;
    }

    // ----- drop zone -----
    .drop-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $indent-x1;
        border: 1px dashed var(--p-dropbox-border-color);
        border-radius: var(--p-dropbox-border-radius);
        background: var(--p-dropbox-background);
        padding: $indent-x2;
        min-height: 160px;
        cursor: pointer;
        transition: border-color 0.15s ease;

        &:hover {
            border-color: var(--p-dropbox-hover-border-color);
        }

        .icon-wrapper .icon {
            font-size: 3rem;
            color: var(--p-dropbox-color);
        }

        .description {
            color: var(--p-dropbox-color);
        }

        &.disabled {
            color: var(--p-dropbox-disabled-color);
            background: var(--p-dropbox-disabled-background);
            cursor: default;
        }
    }

    &.drag-active .drop-box,
    &.drag-active.has-image .preview {
        border-color: var(--p-dropbox-hover-border-color);
    }

    // ----- preview -----
    .preview {
        position: relative;
        display: inline-flex;
        align-self: flex-start;
        max-width: 360px;
        border: 1px solid var(--p-dropbox-border-color);
        border-radius: var(--p-dropbox-border-radius);
        background: var(--p-dropbox-background);
        cursor: pointer;
        overflow: hidden;
        transition: border-color 0.15s ease;

        &:hover:not(.preview-disabled) {
            border-color: var(--p-dropbox-hover-border-color);
        }

        .preview-image {
            display: block;
            max-width: 100%;
            max-height: 160px;
            object-fit: contain;
        }

        .preview-actions {
            position: absolute;
            top: 6px;
            right: 6px;
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.15s ease;
        }

        &:hover .preview-actions,
        &:focus-within .preview-actions {
            opacity: 1;
        }

        &-disabled {
            cursor: default;
        }
    }

    .error-wrapper {
        width: 100%;
    }
}
</style>
