<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnerNotificationsAPI from "@/api/modules/dashboard/partners/partner-notifications"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputNumber from "@c/common/b-input/b-input-number.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import type {
    PartnerNotificationData,
} from "@v/dashboard/partners/notifications/edit/definitions/partner-notification"
import { PartnerNotificationSchema } from "@v/dashboard/partners/notifications/edit/schemas/partner-notification.schema"
import { formatJSDateToStringDate, formatStringDateToJSDate } from "@/lib/date-helpers"
import { controlOptions } from "@/constants/controls"
import { Status } from "@/definitions/status"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): PartnerNotificationData {
    return {
        name:                 "",
        notification_channel: {
            send_telegram:    false,
            telegram_chat_id: "",
            check_payment:    false,
            payment_date:     "",
        },
        report_settings: {
            lost_clients_days:     0,
            returned_clients_days: 0,
            new_clients_days:      0,
            send_missed_calls:     false,
        },
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)

const partnerNotificationId = computed(() => route.params.id as string)

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<PartnerNotificationData>({
    validationSchema: PartnerNotificationSchema,
    initialValues:    defaultState(),
})

const [nameModel] = defineLazyField("name")
const [sendTelegramModel] = defineLazyField("notification_channel.send_telegram")
const [telegramChatIdModel] = defineLazyField("notification_channel.telegram_chat_id")
const [checkPaymentModel] = defineLazyField("notification_channel.check_payment")
const [paymentDateModel] = defineLazyField("notification_channel.payment_date")
const [lostClientsDaysModel] = defineLazyField("report_settings.lost_clients_days")
const [returnedClientsDaysModel] = defineLazyField("report_settings.returned_clients_days")
const [newClientsDaysModel] = defineLazyField("report_settings.new_clients_days")
const [sendMissedCallsModel] = defineLazyField("report_settings.send_missed_calls")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnerNotificationData,
    ] = await Promise.all([
        partnerNotificationsAPI.get(partnerNotificationId.value),
    ])

    if (partnerNotificationData instanceof HttpError) {
        notify.error()
        return
    }

    const partnerNotification = partnerNotificationData.data

    resetForm({
        values: {
            name:                 partnerNotification.name,
            notification_channel: partnerNotification.notification_channel,
            report_settings:      partnerNotification.report_settings,
        },
    })

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardPartnerNotifications })
        return
    }

    isLoading.value = true

    const [partnerNotificationResponse] = await Promise.all([
        partnerNotificationsAPI.update(partnerNotificationId.value, formValues),
    ])

    isLoading.value = false

    if (partnerNotificationResponse instanceof HttpError) {
        if (partnerNotificationResponse?.errors) setErrors(partnerNotificationResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.success"))

    await router.push({
        name: DashboardRouteName.DashboardPartnerNotifications,
    })
})

const paymentDate = computed({
    get() {
        return formatStringDateToJSDate(paymentDateModel.value)
    },
    set(date: Date | null) {
        paymentDateModel.value = formatJSDateToStringDate(date)
    },
})

const sendTelegram = computed({
    get() {
        return sendTelegramModel.value
            ? Status.ACTIVE
            : Status.DISABLED
    },
    set(newValue: Status) {
        sendTelegramModel.value = newValue === Status.ACTIVE
    },
})

const checkPayment = computed({
    get() {
        return checkPaymentModel.value
            ? Status.ACTIVE
            : Status.DISABLED
    },
    set(newValue: Status) {
        checkPaymentModel.value = newValue === Status.ACTIVE
    },
})

const sendMissedCalls = computed({
    get() {
        console.log(sendMissedCallsModel.value)
        return sendMissedCallsModel.value
            ? Status.ACTIVE
            : Status.DISABLED
    },
    set(newValue: Status) {
        sendMissedCallsModel.value = newValue === Status.ACTIVE
    },
})
</script>

<template>
    <b-form
        title="Редактирование уведомлений"
        :path-back="dashboardPaths.DashboardPartnerNotifications"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="partner-notification-view"
        @save="onSave"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Название филиала"
                class="label-align-center"
            >
                <div class="name"> {{ nameModel }} </div>
            </b-form-item>

            <b-form-item
                label="Отправлять в Telegram"
                class="label-align-center"
            >
                <b-select-button
                    v-model="sendTelegram"
                    :options="controlOptions"
                    :error="errors['notification_channel.send_telegram']"
                    option-label="name"
                    option-value="id"
                    :option-class="{
                        [Status.DISABLED]: 'status-disabled',
                    }"
                />
            </b-form-item>

            <b-form-item
                v-if="sendTelegramModel"
                label="Telegram ID"
                required
            >
                <b-input-text
                    v-model="telegramChatIdModel"
                    :disabled="isLoading"
                    :error="errors['notification_channel.telegram_chat_id']"
                />
            </b-form-item>

            <b-form-item label="Проверять оплату">
                <b-select-button
                    v-model="checkPayment"
                    :options="controlOptions"
                    :error="errors['notification_channel.check_payment']"
                    option-label="name"
                    option-value="id"
                    :option-class="{
                        [Status.DISABLED]: 'status-disabled',
                    }"
                />
            </b-form-item>

            <b-form-item
                v-if="checkPaymentModel"
                label="Дата оплаты"
                required
            >
                <b-date-picker
                    v-model="paymentDate"
                    :disabled="isLoading"
                    :error="errors['notification_channel.payment_date']"
                    show-clear
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Настройки уведомлений">
            <b-form-item
                label="Новые клиенты"
                required
            >
                <b-input-number
                    v-model="newClientsDaysModel"
                    :error="errors['report_settings.new_clients_days']"
                    :disabled="isLoading"
                />
            </b-form-item>

            <b-form-item
                label="Повторные клиенты"
                required
            >
                <b-input-number
                    v-model="returnedClientsDaysModel"
                    :error="errors['report_settings.returned_clients_days']"
                    :disabled="isLoading"
                />
            </b-form-item>

            <b-form-item
                label="Потерянные клиенты"
                required
            >
                <b-input-number
                    v-model="lostClientsDaysModel"
                    :error="errors['report_settings.lost_clients_days']"
                    :disabled="isLoading"
                />
            </b-form-item>

            <b-form-item label="Пропущенные звонки">
                <b-select-button
                    v-model="sendMissedCalls"
                    :options="controlOptions"
                    option-label="name"
                    option-value="id"
                    :option-class="{
                        [Status.DISABLED]: 'status-disabled',
                    }"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style lang="scss" scoped>
.partner-notification-view {
    .name {
        display: flex;
        align-items: center;
    }
}
</style>
