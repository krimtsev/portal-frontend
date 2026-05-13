<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useDepartmentStore } from "@s/department/department"
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
import { maxMessageLength } from "@/constants/messages"
import { DepartmentType } from "@/definitions/departments"


const notify = useNotify()
const router = useRouter()
const { t } = useI18n()

const departmentStore = useDepartmentStore()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

function defaultState(): TicketCertificate {
    return {
        title:         t("mc.ticket.certificate.title"),
        type:          TicketType.Certificate,
        partner_id:    null,
        department_id: departmentStore.getIdByType(DepartmentType.Accounting),
        message:       "",
        files:         [],
        attributes:    {
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

    const [partners] = await Promise.all([
        partnerAPI.userPartners(),
    ])

    if (partners instanceof HttpError) {
        notify.error()
        return
    }

    userPartners.value = partners

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
                            :disabled="isDisabled"
                            :error="errors['partner_id']"
                            option-label="name"
                            option-value="partner_id"
                            :placeholder="t('mc.common.partner')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="codeModel"
                            :error="errors['attributes.code']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.code')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-number
                            v-model="sumModel"
                            :error="errors['attributes.sum']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.sum')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-date-picker
                            v-model="paymentDateModel"
                            :error="errors['attributes.paymentDate']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                            hour-format="24"
                            show-time
                            date-format="yy-mm-dd"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.name')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.message')"
                            :maxlength="maxMessageLength"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="filesModel"
                            :error="errors['files']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.certificate.placeholder.files')"
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
