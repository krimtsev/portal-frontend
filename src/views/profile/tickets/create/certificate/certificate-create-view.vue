<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PrimeSelect from "primevue/select"
import BInputText from "@c/common/b-input-text/b-input-text.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BInputNumber from "@c/common/b-input-number/b-input-number.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import { useNotify } from "@/composables/notify/use-notify"
import type { UserPartners } from "@/api/modules/partner/partner"
import { cloneDeep, isEqual } from "lodash"
import * as partnerAPI from "@/api/modules/partner/partner"
import { HttpError } from "@/api"
import * as z from "zod"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import {
    CodeSchema,
    EmployeeNameSchema,
    MessageSchema,
    PartnerIdSchema,
    PaymentDateSchema,
    SumSchema,
} from "@v/profile/tickets/schemas/ticket.schema"
import { FilesSchema } from "@/schemas/zod.schema"
import type { TicketCertificate } from "@v/profile/tickets/create/certificate/definitions/certificate"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"
import { ProfileRouteName } from "@r/profile/route-names"
import { useRouter } from "vue-router"
import {
    type TicketCategoriesItem,
    TicketCategorySlug
} from "@v/profile/tickets/edit/definitions/ticket-category"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
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
            code:         "",
            sum:          null,
            paymentDate:  null,
            name:         "",
        },
    }
}

const initialState = ref<TicketCertificate>(defaultState())
const currentState = ref<TicketCertificate>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

/** Валидация */
const AttributesSchema = z.object({
    name:         EmployeeNameSchema,
    sum:          SumSchema,
    paymentDate:  PaymentDateSchema,
    code:         CodeSchema,
})

const formSchema = z.object({
    attributes:  AttributesSchema,
    message:     MessageSchema,
    partner_id:  PartnerIdSchema,
    files:       FilesSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
const {
    errors,
    submit,
    watchChanges,
    resetErrors
} = useZodResolver<FormSchemaType>(formSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const [partners, category] = await Promise.all([
        partnerAPI.userPartners(),
        ticketAPI.category(TicketCategorySlug.ACCOUNTING)
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

    initialState.value.partner_id = userPartners.value.partner_id
    initialState.value.category_id = ticketCategory.value.id
    currentState.value = cloneDeep(initialState.value)

    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    const params = cloneDeep(currentState.value)
    params.title = t("mc.ticket.certificate.title")

    const resp = await ticketAPI.create(params)

    isLoading.value = false

    if (resp instanceof HttpError) {
        notify.error()
        return
    }

    currentState.value = cloneDeep(initialState.value)
    notify.success(t("mc.ticket.notify.success"))
    resetErrors()

    await router.push({ name: ProfileRouteName.ProfileTickets })
}
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
                        <prime-select
                            v-model="currentState.partner_id"
                            :options="userPartners.partners"
                            :loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            :error="errors.partner_id"
                            optionLabel="name"
                            optionValue="partner_id"
                            :placeholder="t('mc.common.partner')"
                            name="partner_id"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.code"
                            :error="errors.attributes?.code"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.code')"
                            name="code"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-number
                            v-model="currentState.attributes.sum"
                            :error="errors.attributes?.sum"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.sum')"
                            full-width
                            name="sum"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-date-picker
                            v-model="currentState.attributes.paymentDate"
                            :error="errors.attributes?.paymentDate"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                            hour-format="24"
                            show-time
                            full-width
                            dateFormat="dd-mm-yy"
                            name="paymentDate"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.name"
                            :error="errors.attributes?.name"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.name')"
                            name="name"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.message')"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.certificate.placeholder.files')"
                            name="files"
                        />
                    </div>

                    <div class="col-12">
                        <b-button
                            :label="t('mc.common.send')"
                            :disabled="isDisabled"
                            :loading="isLoading"
                            width-full
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
