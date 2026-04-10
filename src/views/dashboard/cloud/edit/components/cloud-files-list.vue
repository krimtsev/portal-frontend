<script setup lang="ts">
import { ref, useTemplateRef } from "vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BText from "@c/common/b-text/b-text.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import type { CloudFile } from "@v/dashboard/cloud/edit/definitions/cloud"
import CloudRemoveFileDialog from "@v/dashboard/cloud/edit/components/cloud-remove-file-dialog.vue"
import CloudEditFileDialog from "@v/dashboard/cloud/edit/components/cloud-edit-file-dialog.vue"
import { HttpError } from "@/api"
import * as cloudFilesAPI from "@/api/modules/dashboard/cloud/cloud-files"
import { downloadExternalFile } from "@/lib/files"
import { useNotify } from "@/composables/notify/use-notify"
import PrimeTag from "primevue/tag"

interface PrimeDataTableInstance {
    $refs: {
        virtualScroller?: {
            scrollToIndex: (index: number, behavior?: "auto" | "smooth") => void
        }
    }
}

const emit = defineEmits<{
    (e: "file:update", file: CloudFile): void
    (e: "file:remove", file: CloudFile): void
}>()

const props = withDefaults(defineProps<{
    cloudId:   string
    isLoading: boolean
    files:     CloudFile[]
}>(), {
    isLoading: false,
    files:     () => ([]),
})

const notify = useNotify()

const tableRef = useTemplateRef<InstanceType<typeof PrimeDataTable>>("tableRef")

const editFileData = ref<CloudFile | null>(null)
const removeFileData = ref<CloudFile | null>(null)
const loadingFiles = ref<Record<string, boolean>>({})

const onEdit = (item: CloudFile) => {
    editFileData.value = item
}

const onRemove = (item: CloudFile) => {
    removeFileData.value = item
}

const onDownload = async (item: CloudFile) => {
    loadingFiles.value[item.id] = true

    try {
        const response = await cloudFilesAPI.download(props.cloudId, item.name)

        if (response instanceof HttpError) {
            notify.error()
            return
        }

        downloadExternalFile(response, `${item.title}.${item.ext}`)
    } finally {
        delete loadingFiles.value[item.id]
    }
}

const scrollToBottom = () => {
    const instance = tableRef.value as unknown as PrimeDataTableInstance
    const scroller = instance?.$refs?.virtualScroller

    if (scroller) {
        scroller.scrollToIndex(props.files.length - 1, "smooth")
    }
}

defineExpose({ scrollToBottom })
</script>

<template>
    <b-form-card
        title="Файлы"
        class="cloud-files-list"
    >
        <b-empty-result
            v-if="!props.isLoading && !props.files.length"
            title="Файлы отсутствуют"
        />

        <prime-data-table
            v-else
            ref="tableRef"
            :value="props.files"
            :loading="props.isLoading"
            scrollable
            scroll-height="400px"
            :virtual-scroller-options="{ itemSize: 48 }"
            data-key="id"
            class="table show-empty"
            column-resize-mode="expand"
        >
            <prime-column
                field="title"
                header="Название"
                class="table-title"
            >
                <template #body="{ data }">
                    <div class="d-flex align-items-center gap-1">
                        <prime-tag
                            v-if="data?.isNew"
                            value="Новый"
                            severity="info"
                        />
                        <b-text :value="data?.title" />
                    </div>
                </template>
            </prime-column>

            <prime-column
                header="Тип"
                field="ext"
                class="table-ext"
            >
                <template #body="slotProps">
                    <b-text
                        :value="slotProps.data.ext"
                        :class="['ext', slotProps.data.ext?.toLowerCase()]"
                    />
                </template>
            </prime-column>

            <prime-column
                header="Скачано"
                field="downloads"
                class="table-downloads"
            />

            <prime-column />

            <prime-column class="table-actions">
                <template #body="{ data }">
                    <div class="table-cell-content">
                        <b-button-icon
                            icon="pi pi-download"
                            severity="contrast"
                            :is-loading="loadingFiles[data.id]"
                            @click="onDownload(data)"
                        />

                        <b-button-icon
                            icon="pi pi-pencil"
                            severity="contrast"
                            @click="onEdit(data)"
                        />

                        <b-button-icon
                            icon="pi pi-times"
                            severity="danger"
                            @click="onRemove(data)"
                        />
                    </div>
                </template>
            </prime-column>
        </prime-data-table>

        <cloud-edit-file-dialog
            v-model="editFileData"
            :cloud-id="props.cloudId"
            @after-edit="emit('file:update', $event)"
        />

        <cloud-remove-file-dialog
            v-model="removeFileData"
            :cloud-id="props.cloudId"
            @after-remove="emit('file:remove', $event)"
        />
    </b-form-card>
</template>

<style scoped lang="scss">
$height-row: 48px;

.cloud-files-list {
    :deep(.p-datatable) {
        @include table;

        .p-datatable-thead {
            background-color: var(--p-dashboard-card-background) !important;
        }

        .table-title {
            @include col-width(500px);
            @include text-overflow;

            height: $height-row;
        }

        .table-ext {
            @include col-width(100px);
            @include file-colors;
        }

        .table-downloads {
            @include col-width(100px);
        }

        .table-actions {
            @include col-width(120px);
            @include table-column-align(flex-end);

            .table-cell-content {
                gap: $indent-x1;
            }
        }
    }
}
</style>
