<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeToggleSwitch from "primevue/toggleswitch"
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
import BTitle from "@c/common/b-title/b-title.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { TicketCertificate } from "@v/profile/tickets/create/certificate/definitions/certificate"
import { createFormSchema } from "@v/profile/tickets/create/certificate/schemas/certificate.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { stripTimezone } from "@/lib/date-helpers"
import { maxMessageLength } from "@/constants/messages"
import { DepartmentType } from "@/definitions/departments"

const notify = useNotify()
const router = useRouter()
const { t } = useI18n()

const departmentStore = useDepartmentStore()

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isBankRequired = ref(true)

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

            //Банковские реквизиты
            entrepreneurName:     "",
            inn:                  "",
            checkingAccount:      "",
            bankName:             "",
            bik:                  "",
            correspondentAccount: "",
        },
    }
}

const isDisabled = computed(() => isFirstLoading.value || isLoading.value)

const validationSchema = computed(() => createFormSchema(isBankRequired.value))

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
    setFieldValue,
} = useVeeForm<TicketCertificate>({
    validationSchema,
    initialValues: defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [codeModel] = defineLazyField("attributes.code")
const [sumModel] = defineLazyField("attributes.sum")
const [paymentDateModel] = defineLazyField("attributes.paymentDate")
const [nameModel] = defineLazyField("attributes.name")

const [entrepreneurNameModel] = defineLazyField("attributes.entrepreneurName")
const [innModel] = defineLazyField("attributes.inn")
const [checkingAccountModel] = defineLazyField("attributes.checkingAccount")
const [bankNameModel] = defineLazyField("attributes.bankName")
const [bikModel] = defineLazyField("attributes.bik")
const [correspondentAccountModel] = defineLazyField("attributes.correspondentAccount")

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

    const {
        entrepreneurName,
        inn,
        checkingAccount,
        bankName,
        bik,
        correspondentAccount,
        ...baseAttributes
    } = formValues.attributes

    const paymentDate = stripTimezone(formValues.attributes.paymentDate)

    const attributes = isBankRequired.value
        ? {
            ...baseAttributes,
            paymentDate,
            entrepreneurName,
            inn,
            checkingAccount,
            bankName,
            bik,
            correspondentAccount,
        }
        : {
            ...baseAttributes,
            paymentDate,
        }

    const payload = {
        ...formValues,
        attributes,
    }

    const ticketResponse = await ticketAPI.create(payload)

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
                            full-width
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
                </div>

                <div class="bank-details">
                    <b-title
                        title="Реквизиты"
                        variant="sm"
                        class="my-x2"
                    />

                    <PrimeToggleSwitch v-model="isBankRequired" />
                </div>

                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <template v-if="isBankRequired">
                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="entrepreneurNameModel"
                                :error="errors['attributes.entrepreneurName']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.entrepreneurName')"
                                class="full-width"
                            />
                        </div>

                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="innModel"
                                :error="errors['attributes.inn']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.inn')"
                                :maxlength="12"
                                class="full-width"
                            />
                        </div>

                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="checkingAccountModel"
                                :error="errors['attributes.checkingAccount']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.checkingAccount')"
                                :maxlength="20"
                                class="full-width"
                            />
                        </div>

                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="bankNameModel"
                                :error="errors['attributes.bankName']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.bankName')"
                                class="full-width"
                            />
                        </div>

                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="bikModel"
                                :error="errors['attributes.bik']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.bik')"
                                :maxlength="9"
                                class="full-width"
                            />
                        </div>

                        <div class="col-6 mobile-col-12">
                            <b-input-text
                                v-model="correspondentAccountModel"
                                :error="errors['attributes.correspondentAccount']"
                                :disabled="isDisabled"
                                :placeholder="t('mc.ticket.certificate.placeholder.correspondentAccount')"
                                :maxlength="20"
                                class="full-width"
                            />
                        </div>
                    </template>

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
                            class="full-width"
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

    .bank-details {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $indent-x1;
    }
}
</style>
