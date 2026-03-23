<script setup lang="ts">
import { computed, ref, watch } from "vue"
import PrimeFileUpload from "primevue/fileupload"
import PrimeMessage from "primevue/message"
import BSvg from "@c/common/b-svg/b-svg.vue"
import type {
    FileUploadSelectEvent,
    FileUploadUploadEvent,
} from "primevue/fileupload"
import BInputError from "@c/common/b-input-error/b-input-error.vue"
import PrimeButton from "primevue/button"
import PrimeProgressBar from "primevue/progressbar"
import i18n from "@/plugins/i18n"
import { useI18n } from "vue-i18n"

type FileUploadExpose = {
    clear: () => void;
    files: any[];
    choose: () => void;
}

const emit = defineEmits<{
    (e: "upload"): void
}>()

const { t } = useI18n()

const model = defineModel<File | File[] | null>({ default: null })

const defaultAccept = "image/*, text/plain, application/pdf"

const props = withDefaults(defineProps<{
    accept?:       string
    multiple?:     boolean
    maxFileSize?:  number
    name?:         string
    error?:        string
    disabled?:     boolean
    isProcessing?: boolean
    placeholder?:  string
    showHeader?:   boolean
}>(), {
    accept:      defaultAccept,
    multiple:    true,
    maxFileSize: 1024 * 1024,
    name:        "files[]",
    disabled:    false,
    placeholder: i18n.global.t("mc.components.fileUpload.placeholder"),
    error:       "",
    showHeader:  false
})

const uploader = ref<InstanceType<typeof PrimeFileUpload> & FileUploadExpose | null>(null)

const isDisabled = computed(() => props.disabled || props.isProcessing)

const onUpload = (event: FileUploadUploadEvent) => {
    model.value = event.files
}

const onSelect = (event: FileUploadSelectEvent) => {
    model.value = event.files
}

const removeFile = (index: number, removeFileCallback: (index: number) => void) => {
    if (isDisabled.value) return

    removeFileCallback(index)

    if (!model.value) return
    if (Array.isArray(model.value)) {
        model.value = [...model.value.slice(0, index), ...model.value.slice(index + 1)]
    } else {
        model.value = null
    }
}

watch(model, (newVal) => {
    if (Array.isArray(newVal) && newVal.length === 0) {
        uploader.value?.clear()
    }
})
</script>

<template>
    <div
        class="b-file-upload"
        :class="{
            'disabled': isDisabled,
            'hide-header': !props.showHeader
        }"
    >
        <prime-file-upload
            ref="uploader"
            :model-value="model"
            :name="props.name"
            :accept="props.accept"
            :multiple="props.multiple"
            :max-file-size="props.maxFileSize"
            :auto="false"
            :show-header="props.showHeader"
            :invalid-file-type-message="t('mc.components.fileUpload.errors.type')"
            :invalid-file-size-message="t('mc.components.fileUpload.errors.type', { size: props.maxFileSize / 1024 })"
            :disabled="isDisabled"
            custom-upload
            @upload="onUpload"
            @select="onSelect"
        >
            <template #header="{ clearCallback, files }">
                <div class="header">
                    <div class="header-buttons">
                        <prime-button
                            icon="pi pi-cloud-upload"
                            variant="outlined"
                            :label="t('mc.components.fileUpload.buttons.upload')"
                            :disabled="isDisabled || !files || files.length === 0"
                            @click="emit('upload')"
                        />
                        <prime-button
                            icon="pi pi-times"
                            variant="outlined"
                            severity="secondary"
                            :label="t('mc.components.fileUpload.buttons.cancel')"
                            :disabled="isDisabled || !files || files.length === 0"
                            @click="clearCallback()"
                        />
                    </div>

                    <prime-progress-bar
                        :mode="props.isProcessing ? 'indeterminate' : 'determinate'"
                        class="progress"
                    />
                </div>
            </template>

            <template #content="{ files, removeFileCallback, messages }">
                <div
                    class="upload"
                    @click="uploader?.choose()"
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
                    v-if="files.length"
                    class="file-wrapper"
                >
                    <div class="files">
                        <div class="file-label">
                            {{ t('mc.components.fileUpload.label') }}
                        </div>

                        <div
                            v-for="(file, index) of files"
                            :key="`${file.name}_${index}`"
                        >
                            <div
                                class="file-item"
                                :class="{
                                    'file-item-disabled': isDisabled
                                }"
                                @click="removeFile(index, removeFileCallback)"
                            >
                                <span> {{ file.name }} </span>
                                <b-svg
                                    class="close"
                                    name="pi-times"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="messages?.length"
                    class="errors"
                >
                    <prime-message
                        v-for="message of messages"
                        :key="message"
                        severity="error"
                    >
                        {{ message }}
                    </prime-message>
                </div>

                <b-input-error :error="props.error" />
            </template>
        </prime-file-upload>
    </div>
</template>

<style scoped lang="scss">
.b-file-upload {
    :deep(.p-fileupload) {
        border: none;
        border-radius: 0;
        background: transparent;
        overflow: hidden;

        .p-fileupload-content {
            padding: 0;
            border-radius: var(--p-form-field-border-radius);
        }
    }

    .file-wrapper {
        padding: 0 $indent-x2;
        color: var(--p-surface-400);

        .files {
            display: flex;
            flex-wrap: wrap;
            gap: $indent-x1;

            .file-item {
                display: flex;
                align-items: end;
                gap: $indent-x1;
                cursor: pointer;

                .close {
                    font-size: 0.8rem;
                    line-height: 1rem;
                    color: var(--p-surface-400);
                }

                &:hover:not(.file-item-disabled) {
                    color: var(--p-surface-300);

                    .close {
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

    .header {
        width: 100%;

        &-buttons {
            display: flex;
            gap: $indent-x1;
        }

        .progress {
            height: 8px;
            width: 100%;
            margin-top: $indent-x1;
        }
    }

    .upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $indent-x1;
        border: 1px dashed var(--p-fileupload-border-color);
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
    }

    .errors {
        margin-bottom: $indent-x1;
    }

    &.disabled {
        .upload {
            background: var(--p-form-field-disabled-background);
            cursor: default;
        }
    }

    &.hide-header {
        :deep(.p-fileupload-header) {
            display: none;
        }
    }
}
</style>
