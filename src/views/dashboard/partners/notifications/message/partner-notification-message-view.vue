<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { HttpError } from "@/api"
import * as partnerMessagesAPI from "@/api/modules/dashboard/partners/partner-messages"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BMultiSelect, { type MultiSelectItem } from "@c/common/b-select/b-multi-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import type {
    PartnerMessageData,
    PartnerMessageOption,
} from "@v/dashboard/partners/notifications/message/definitions/partner-notification-message"
import {
    BroadcastNotificationSchema,
} from "@v/dashboard/partners/notifications/message/schemas/partner-notifications-message.schema"
import { createMessageFormData } from "@v/dashboard/partners/notifications/message/utils/partner-notification-message"
import { maxMessageLength } from "@/constants/messages"
import { FilterType } from "@/definitions/filter"


const notify = useNotify()

function defaultState(): PartnerMessageData {
    return {
        partner_ids: [],
        message:     "",
        file:        undefined,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)

const partners = ref<PartnerMessageOption[]>([])

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    setErrors,
} = useVeeForm<PartnerMessageData>({
    validationSchema: BroadcastNotificationSchema,
    initialValues:    defaultState(),
})

const [partnerIdsModel] = defineLazyField("partner_ids")
const [messageModel] = defineLazyField("message")
const [fileModel] = defineLazyField("file")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnerNotificationData,
    ] = await Promise.all([
        partnerMessagesAPI.options(),
    ])

    if (partnerNotificationData instanceof HttpError) {
        notify.error()
        return
    }

    partners.value = partnerNotificationData.list

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    isLoading.value = true

    const formData = createMessageFormData(formValues)

    const res = await partnerMessagesAPI.send(formData)

    isLoading.value = false

    if (res instanceof HttpError) {
        if (res?.errors) setErrors(res.errors)
        notify.error()
        return
    }

    notify.success("Сообщение отправлено в очередь")

    resetForm({
        values: defaultState(),
    })
})

const partnerOptions = computed<MultiSelectItem[]>(() => {
    return [
        {
            id:    "basic",
            items: [
                {
                    id:    FilterType.ALL,
                    title: "Все филиалы",
                },
                {
                    id:    FilterType.TEST,
                    title: "Тестовое сообщение",
                },
            ],
            isSingleChoice: true,
        },
        {
            id:    "partners",
            title: "Филилалы",
            items: partners.value.map(item => ({
                id:    item.id,
                title: item.name,
            })),
        },
    ]
})
</script>

<template>
    <b-form
        title="Рассылка сообщения"
        :path-back="dashboardPaths.DashboardPartnerNotifications"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        save-text="Отправить"
        class="partner-notification-message-view"
        @save="onSave"
    >
        <b-form-card title="Настройка сообщения">
            <b-form-item
                label="Филиалы"
                required
            >
                <b-multi-select
                    v-model="partnerIdsModel"
                    :options="partnerOptions"
                    option-label="title"
                    option-value="id"
                    placeholder="Выберите филиалы"
                    :disabled="isLoading"
                    :error="errors['partner_ids']"
                    filter
                />
            </b-form-item>

            <b-form-item
                label="Сообщение"
                required
            >
                <b-textarea
                    v-model="messageModel"
                    :error="errors['message']"
                    :disabled="isLoading"
                    placeholder="Сообщение"
                    :maxlength="maxMessageLength"
                    class="full-width"
                />
            </b-form-item>

            <b-form-item label="Файл">
                <b-file-upload
                    v-model="fileModel"
                    :error="errors['file']"
                    :disabled="isLoading"
                    :multiple="false"
                    class="full-width"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style scoped lang="scss">
.partner-notification-message-view {

}
</style>
