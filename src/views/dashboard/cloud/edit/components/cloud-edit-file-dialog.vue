<script setup lang="ts">
import { computed, ref, watch } from "vue"
import BDialogConfirm from "@c/common/b-dialog/b-dialog-confirm.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import { useNotify } from "@/composables/notify/use-notify"
import type { CloudFile } from "@v/dashboard/cloud/edit/definitions/cloud"
import * as cloudFilesAPI from "@/api/modules/dashboard/cloud/cloud-files"
import { HttpError } from "@/api"
import BDialogSection from "@c/common/b-dialog/b-dialog-section.vue"
import BDialogItem from "@c/common/b-dialog/b-dialog-item.vue"
import { useForm } from "vee-validate"
import { CloudFileUpdateSchema } from "@v/dashboard/cloud/edit/schemas/cloud.schema"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"

const props = defineProps<{
    cloudId: string,
}>()

const emit = defineEmits<{
    (e: "after-edit", file: CloudFile): void
}>()

const model = defineModel<CloudFile | null>({ default: null })

const notify = useNotify()

const isLoading = ref(false)

const {
    errors,
    resetForm,
    handleSubmit,
    defineField,
    meta,
    submitCount,
    setErrors
} = useForm({
    validationSchema: CloudFileUpdateSchema,
})

const dynamicConfig = useConfigValidation(submitCount)

const [title] = defineField("title", dynamicConfig)

const isShowDialog = computed(() => !!model.value)

watch(() => model.value, (newFile) => {
    if (newFile) {
        resetForm({
            values: {
                title: newFile.title
            }
        })
    }
})

const onUpdate = handleSubmit(async (values) => {
    if (!meta.value.dirty || !model.value?.id) {
        model.value = null
        return
    }

    isLoading.value = true

    const response = await cloudFilesAPI.update(props.cloudId, model.value.id, {
        title: values.title
    })

    isLoading.value = false

    if (response instanceof HttpError) {
        if (response?.errors) setErrors(response.errors)
        notify.error()
        return
    }

    const updatedFile = {
        ...model.value,
        title: values.title
    }

    notify.success("Файл успешно изменен")
    model.value = null
    emit("after-edit", updatedFile)
})
</script>

<template>
    <b-dialog-confirm
        v-model="isShowDialog"
        title="Редактирование файла"
        :is-loading="isLoading"
        @confirm="onUpdate"
        @cancel="model = null"
    >
        <b-dialog-section>
            <b-dialog-item
                label="Название файла"
                required
            >
                <b-input-text
                    v-model.trim="title"
                    :disabled="isLoading"
                    :error="errors.title"
                    placeholder="Введите название"
                />
            </b-dialog-item>
        </b-dialog-section>
    </b-dialog-confirm>
</template>
