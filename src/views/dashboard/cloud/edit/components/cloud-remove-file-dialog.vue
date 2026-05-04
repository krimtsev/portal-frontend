<script setup lang="ts">
import { computed, ref } from "vue"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as cloudFilesAPI from "@/api/modules/dashboard/cloud/cloud-files"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import type { CloudFile } from "@v/dashboard/cloud/edit/definitions/cloud"

const model = defineModel<CloudFile | null>({ default: null })

const emit = defineEmits<{
    (e: "after-remove", file: CloudFile): void
}>()

const props = defineProps<{
    cloudId: string
}>()

const notify = useNotify()

const isShowDialog = computed(() => !!model.value)
const isLoading = ref(false)

const fileName = computed(() => model.value?.title || "")

const remove = async () => {
    if (!model.value?.id) {
        model.value = null
        return
    }

    isLoading.value = true

    const cloudResponse = await cloudFilesAPI.remove(props.cloudId, model.value.id)

    isLoading.value = false

    if (cloudResponse instanceof HttpError) {
        notify.error()
        return
    }

    const removedFile = { ...model.value }

    notify.success("Файл успешно удален")
    model.value = null
    emit("after-remove", removedFile)
}
</script>

<template>
    <b-dialog-remove
        v-model="isShowDialog"
        :is-loading="isLoading"
        @confirm="remove"
        @cancel="model = null"
    >
        <p> Вы действительно хотите удалить файл <b>"{{ fileName }}"</b>? </p>
    </b-dialog-remove>
</template>
