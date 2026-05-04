<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import type { UserPartners } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import BButton from "@c/common/b-button/b-button.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BInputNumber from "@c/common/b-input/b-input-number.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { TicketCertificate } from "@v/profile/tickets/create/certificate/definitions/certificate"
import { FormSchema } from "@v/profile/tickets/create/certificate/schemas/certificate.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import {
    type TicketCategoriesItem,
    TicketCategorySlug,
} from "@v/profile/tickets/edit/definitions/ticket-category"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

const ticketCategory = ref<TicketCategoriesItem>()

function defaultState(): TicketCertificate {
    return {
        title:       t("mc.ticket.certificate.title"),
        type:        TicketType.Certificate,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            code:        "",
            sum:         null,
            paymentDate: null,
            name:        "",
        },
    }
}

const isDisabled = computed(() => isFirstLoading.value || isLoading.value)

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
    setFieldValue,
} = useVeeForm<TicketCertificate>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [codeModel] = defineLazyField("attributes.code")
const [sumModel] = defineLazyField("attributes.sum")
const [paymentDateModel] = defineLazyField("attributes.paymentDate")
const [nameModel] = defineLazyField("attributes.name")

onMounted(async () => {
    isFirstLoading.value = true

    const [partners, category] = await Promise.all([
        partnerAPI.userPartners(),
        ticketAPI.category(TicketCategorySlug.ACCOUNTING),
    ])

    if (
        partners instanceof HttpError ||
        category instanceof HttpError
    ) {
        notify.error()
        return
    }

    userPartners.value = partners
    ticketCategory.value = category.data

    setFieldValue("category_id", ticketCategory.value.id)
    setFieldValue("partner_id", userPartners.value.partner_id)

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) return

    isLoading.value = true

    const ticketResponse = await ticketAPI.create(formValues)

    isLoading.value = false

    if (ticketResponse instanceof HttpError) {
        if (ticketResponse?.errors) setErrors(ticketResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.ticket.notify.success"))
    await router.push({ name: ProfileRouteName.ProfileTickets })
})
</script>

<template>
    <portal-page
        :title="t('mc.ticket.certificate.title')"
        right-image="template/ticket-certificate.png"
        class="certificate-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">
                        <b-select
                            v-model="partnerIdModel"
                            :options="userPartners.partners"
                            :is-loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            :error="errors['partner_id']"
                            option-label="name"
                            option-value="partner_id"
                            :placeholder="t('mc.common.partner')"
                            name="partner_id"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="codeModel"
                            :error="errors['attributes.code']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.code')"
                            name="code"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-number
                            v-model="sumModel"
                            :error="errors['attributes.sum']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.sum')"
                            name="sum"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-date-picker
                            v-model="paymentDateModel"
                            :error="errors['attributes.paymentDate']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                            hour-format="24"
                            show-time
                            date-format="yy-mm-dd"
                            name="paymentDate"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.name')"
                            name="name"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.message')"
                            :maxlength="maxMessageLength"
                            name="message"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="filesModel"
                            :error="errors['files']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.files')"
                            name="files"
                        />
                    </div>

                    <div class="col-12">
                        <b-button
                            :label="t('mc.common.send')"
                            :disabled="isDisabled"
                            :is-loading="isLoading"
                            class="full-width"
                            @click="onSave"
                        />
                    </div>
                </div>
            </div>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.certificate-create-view {
    margin-bottom: $indent-x4;
}
</style>
