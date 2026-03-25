<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import BForm from "@c/common/b-form/b-form.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import type { CloudData, CloudFile } from "@v/dashboard/cloud/edit/definitions/cloud"
import { useForm } from "vee-validate"
import { CloudSchema, CloudFileSchema } from "@v/dashboard/cloud/edit/schemas/cloud.schema"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import { type CloudOptionItem } from "@v/dashboard/cloud/list/definitions/cloud-list"
import { HttpError } from "@/api"
import * as cloudAPI from "@/api/modules/dashboard/cloud/cloud"
import * as cloudFilesAPI from "@/api/modules/dashboard/cloud/cloud-files"
import { rootFolders } from "@v/portal/cloud/utils/cloud"
import CloudFilesList from "@v/dashboard/cloud/edit/components/cloud-files-list.vue"
import BTreeSelect from "@c/common/b-select/b-tree-select.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isProcessing = ref(false)

const categories = ref<CloudOptionItem[]>([])
const files = ref<CloudFile[]>([])
const isRootFolder = ref(false)
const filesListRef = ref<InstanceType<typeof CloudFilesList> | null>(null)

const cloudId = computed(() => route.params.id as string)
const isNew = computed(() => cloudId.value === "!new")

const validationSchema = computed(() => CloudSchema(isRootFolder.value))

const folderForm = useForm<CloudData>({
    validationSchema: validationSchema,
    initialValues:    {
        name:        "",
        slug:        "",
        category_id: null,
    },
})

const folderDynamicConfig = useConfigValidation(folderForm.submitCount)
const [nameModel]       = folderForm.defineField("name", folderDynamicConfig)
const [slugModel]       = folderForm.defineField("slug", folderDynamicConfig)
const [categoryIdModel] = folderForm.defineField("category_id", folderDynamicConfig)

const folderErrors = computed(() => folderForm.errors.value)

const uploadForm = useForm<{ files: File[] }>({
    validationSchema: CloudFileSchema,
    initialValues: {
        files: []
    }
})

const [filesModel] = uploadForm.defineField("files")

const uploadErrors = computed(() => uploadForm.errors.value)

onMounted(async () => {
    isFirstLoading.value = true

    const optionsTreeParams = !isNew.value
        ? { exclude_id: cloudId.value }
        : {}

    const [
        cloudFoldersData,
        cloudData,
    ] = await Promise.all([
        cloudAPI.optionsTree(optionsTreeParams),
        !isNew.value ? cloudAPI.get(cloudId.value) : null,
    ])

    if (
        cloudFoldersData instanceof HttpError ||
        cloudData instanceof HttpError
    ) {
        notify.error()
        return
    }

    categories.value = cloudFoldersData.list

    if (cloudData) {
        const cloud = cloudData.data

        isRootFolder.value = rootFolders.includes(cloud.slug)

        folderForm.resetForm({
            values: {
                name:        cloud.name,
                slug:        cloud.slug,
                category_id: cloud.category_id
            }
        })

        files.value = cloud.files
    }

    isFirstLoading.value = false
})

const onSave = folderForm.handleSubmit(async (formValues) => {
    if (!isNew.value && !folderForm.meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardCloudList })
        return
    }

    isLoading.value = true

    const [cloudResponse] = await Promise.all([
        isNew.value
            ? cloudAPI.create(cloudId.value, formValues)
            : cloudAPI.update(cloudId.value, formValues)
    ])

    isLoading.value = false

    if (cloudResponse instanceof HttpError) {
        if (cloudResponse?.errors) folderForm.setErrors(cloudResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.cloud.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardCloudList
    })
})

const fileUpdate = (item: CloudFile) => {
    const index = files.value.findIndex(f => f.id === item.id)
    if (index !== -1) {
        files.value[index] = { ...files.value[index], ...item }
    }
}

const fileRemove = (item: CloudFile) => {
    files.value = files.value.filter(f => f.id !== item.id)
}

const fileUpload = uploadForm.handleSubmit(async (formValues) => {
    if (uploadForm.errors.value.files) return

    isProcessing.value = true

    const response = await cloudFilesAPI.upload(cloudId.value, formValues.files)

    isProcessing.value = false

    if (response instanceof HttpError) {
        if (response?.errors) uploadForm.setErrors(response.errors)
        notify.error()
        return
    }

    const newFiles = response.data.map((file: CloudFile) => ({ ...file, isNew: true }))

    files.value = [...files.value, ...newFiles]

    uploadForm.resetForm()

    notify.success(t("mc.dashboard.cloud.notify.filesUploaded"))
    await nextTick(() => filesListRef.value?.scrollToBottom())
})
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание каталога'
            : 'Редактирование каталога'"
        :pathBack="dashboardPaths.DashboardCloudList"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="cloud-view"
        @save="onSave"
    >
        <b-form-card title="Каталог">
            <b-form-item
                label="Название"
                required
            >
                <b-input-text
                    v-model="nameModel"
                    :disabled="isLoading"
                    :error="folderErrors.name"
                />
            </b-form-item>

            <b-form-item
                v-if="!isRootFolder"
                label="Ссылка"
                required
            >
                <b-input-text
                    v-model="slugModel"
                    :disabled="isLoading"
                    :error="folderErrors.slug"
                />
            </b-form-item>

            <b-form-item
                v-if="!isRootFolder"
                label="Категория"
            >
                <b-tree-select
                    v-model="categoryIdModel"
                    :disabled="isLoading"
                    :options="categories"
                    :error="folderErrors.category_id"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    map-value
                />
            </b-form-item>
        </b-form-card>

        <cloud-files-list
            ref="filesListRef"
            :files="files"
            :is-loading="isLoading"
            :cloud-id="cloudId"
            @file:update="fileUpdate"
            @file:remove="fileRemove"
        />

        <b-form-card title="Загрузка файлов">
            <b-form-item>
                <b-file-upload
                    v-model="filesModel"
                    :error="uploadErrors.files"
                    :disabled="isLoading"
                    :is-processing="isProcessing"
                    show-actions
                    class="upload-files"
                    @upload="fileUpload"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style lang="scss" scoped>
.cloud-view {
    .upload-files {
        width: 100%;
    }
}
</style>
