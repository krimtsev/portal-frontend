<script setup lang="ts">
import { ref } from "vue"
import PrimeFileUpload from "primevue/fileupload"
import PrimeMessage from "primevue/message"
import BSvg from "@c/common/b-svg/b-svg.vue"
import type {
    FileUploadSelectEvent,
    FileUploadUploadEvent,
} from "primevue/fileupload"

interface UploadProps {
    modelValue?: File[] | null
    accept?: string
    multiple?: boolean
    maxFileSize?: number
    name?: string
    error?: string
    disabled?: boolean
    placeholder?: string
}

type FileUploadExpose = {
    choose: () => void
}

const model = defineModel<File | File[] | null>()

const defaultAccept = "image/*, text/plain, application/pdf"

const props = withDefaults(defineProps<UploadProps>(), {
    accept:      defaultAccept,
    multiple:    true,
    maxFileSize: 1024 * 1024,
    name:        "files[]",
    disabled:    false,
    placeholder: "Добавить файлы"
})

const uploader = ref<InstanceType<typeof PrimeFileUpload> & FileUploadExpose | null>(null)

const onUpload = (event: FileUploadUploadEvent) => {
    model.value = event.files
}

const onSelect = (event: FileUploadSelectEvent) => {
    console.log(props)
    model.value = event.files
}

const removeFile = (index: number, removeFileCallback: (index: number) => void) => {
    removeFileCallback(index)

    if (!model.value) return
    if (Array.isArray(model.value)) {
        model.value = [...model.value.slice(0, index), ...model.value.slice(index + 1)]
    } else {
        model.value = null
    }
}
</script>

<template>
    <div
        class="b-file-upload"
        :class="{
            'disabled': props.disabled,
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
            :show-upload-button="false"
            :show-cancel-button="false"
            :invalid-file-type-message="'Неподдерживаемый тип файла'"
            :invalid-file-size-message="`Файл слишком большой. Максимум ${props.maxFileSize/1024} KB`"
            :disabled="props.disabled"
            custom-upload
            @update:model-value="(v: File[] | null) => model = v"
            @upload="onUpload"
            @select="onSelect"
        >
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
                    <div class="files">Добавлены файлы:
                        <div
                            v-for="(file, index) of files"
                            :key="`${file.name}_${index}`"
                        >
                            <div
                                class="file-item"
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

                <prime-message
                    v-else-if="props.error"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="error"
                >
                    {{ props.error }}
                </prime-message>
            </template>
        </prime-file-upload>
    </div>
</template>

<style scoped lang="scss">
.b-file-upload {
    :deep(.p-fileupload) {
        border: none;
        border-radius: 0; // var(--p-inputtext-border-radius);
        background: transparent;
        overflow: hidden;

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

                    &:hover {
                        color: var(--p-surface-300);

                        .close {
                            color: var(--p-red-500);
                        }
                    }

                }
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

        .p-fileupload-header {
            display: none;
        }

        .p-fileupload-content {
            padding: 0;
            border-radius: var(--p-form-field-border-radius);
        }
    }

    &.disabled {
        :deep(.p-fileupload) {
            .p-fileupload-content {
                background: var(--p-form-field-disabled-background);
            }

            .upload {
                cursor: default;
            }
        }
    }
}
</style>
