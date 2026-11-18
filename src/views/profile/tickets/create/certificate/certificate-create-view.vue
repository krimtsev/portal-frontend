<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useDepartmentStore } from "@s/department/department"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import * as bankDetailsAPI from "@/api/modules/bank-details/bank-details"
import type { UserPartners } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/tickets/tickets"
import BButton from "@c/common/b-button/b-button.vue"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BInputNumber from "@c/common/b-input/b-input-number.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { BankDetailOptionItem } from "@v/profile/bank-details/edit/definitions/bank-detail"
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
const selectedBankDetailId = ref<number | null>(null)
const bankDetailsOptions = ref<BankDetailOptionItem[]>([])

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

const isApplyDisabled = computed(
    () => isDisabled.value || selectedBankDetailId.value === null,
)

const validationSchema = computed(() => createFormSchema())

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

    try {
        const [partners, options] = await Promise.all([
            partnerAPI.userPartners(),
            bankDetailsAPI.options(),
        ])

        if (partners instanceof HttpError) {
            notify.error()
            return
        }

        userPartners.value = partners
        setFieldValue("partner_id", userPartners.value.partner_id)

        if (!(options instanceof HttpError)) {
            bankDetailsOptions.value = options.list
        }
    } finally {
        isFirstLoading.value = false
    }
})

function onApplyBankDetails() {
    if (selectedBankDetailId.value === null) return

    const option = bankDetailsOptions.value.find(
        item => item.id === selectedBankDetailId.value,
    )
    if (!option) return

    entrepreneurNameModel.value = option.entrepreneur_name
    innModel.value = option.inn
    checkingAccountModel.value = option.checking_account
    bankNameModel.value = option.bank_name
    bikModel.value = option.bik
    correspondentAccountModel.value = option.correspondent_account

    selectedBankDetailId.value = null
}

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) return

    isLoading.value = true

    const paymentDate = stripTimezone(formValues.attributes.paymentDate)

    const attributes = {
        ...formValues.attributes,
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

async function onEditBankDetails() {
    await router.push({ name: ProfileRouteName.ProfileBankDetails })
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
                        <b-select
                            v-model="partnerIdModel"
                            :options="userPartners.partners"
                            :disabled="isDisabled"
                            :error="errors['partner_id']"
                            option-label="name"
                            option-value="id"
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

                <b-title
                    title="Реквизиты"
                    variant="sm"
                    class="my-x2"
                />

                <div class="grid grid-reset-rows gap-x-2 gap-y-3 mb-x2">
                    <div class="col-6 mobile-col-12">
                        <div class="bank-details">
                            <b-select
                                v-model="selectedBankDetailId"
                                :options="bankDetailsOptions"
                                :disabled="isDisabled"
                                show-clear
                                option-label="entrepreneur_name"
                                option-value="id"
                                :placeholder="t('mc.ticket.certificate.placeholder.bankDetail')"
                                class="bank-details-select"
                                full-width
                            >
                                <template #option="{ option }">
                                    <div class="bank-detail-option">
                                        <div class="bank-detail-option-title">
                                            {{ option.entrepreneur_name }}
                                        </div>
                                        <div class="bank-detail-option-subtitle">
                                            <span>
                                                р\с: {{ option.checking_account }}
                                            </span>

                                            <span v-if="option.partner">
                                                ({{ option.partner.name }})
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </b-select>

                            <b-button-secondary
                                :label="t('mc.common.button.apply')"
                                :disabled="isApplyDisabled || isDisabled"
                                @click="onApplyBankDetails"
                            />

                            <b-button-icon
                                :disabled="isDisabled"
                                icon="pi pi-pencil"
                                variant="outlined"
                                severity="secondary"
                                @click="onEditBankDetails"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
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
        align-items: center;
        gap: $indent-x1;

        .bank-details-select {
            flex: 1;
        }
    }

    .bank-details-link {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .bank-detail-option {
        display: flex;
        flex-direction: column;

        &-subtitle {
            @include small-text;

            display: flex;
            flex-direction: row;
            gap: calc($indent-x1 / 2);
            line-height: inherit;
            color: var(--p-text-muted-color);
        }
    }
}
</style>
