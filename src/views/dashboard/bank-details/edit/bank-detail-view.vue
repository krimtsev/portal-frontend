<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as bankDetailsAPI from "@/api/modules/dashboard/bank-details/bank-details"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners.ts"
import * as usersAPI from "@/api/modules/dashboard/users/users.ts"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import DadataBankDialog from "@c/dadata/dadata-bank-dialog.vue"
import DadataPartyDialog from "@c/dadata/dadata-party-dialog.vue"
import type { BankData, PartyData } from "@c/dadata/definitions/dadata"
import type { BankDetailData } from "@v/dashboard/bank-details/edit/definitions/bank-detail"
import { BankDetailSchema } from "@v/dashboard/bank-details/edit/schemas/bank-detail.schema"
import type { PartnerOptionItem } from "@v/dashboard/partners/company/list/definitions/partners"
import type { UserOptionItem } from "@v/dashboard/users/edit/definitions/user"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): BankDetailData {
    return {
        entrepreneur_name:     "",
        inn:                   "",
        checking_account:      "",
        bank_name:             "",
        bik:                   "",
        correspondent_account: "",
        user_id:               null,
        partner_id:            null,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isShowRemoveDialog = ref(false)

const isDaDataPartyDialogVisible = ref(false)
const isDaDataBankDialogVisible = ref(false)

const partnerOptions = ref<PartnerOptionItem[]>([])
const userOptions = ref<UserOptionItem[]>([])

const bankDetailId = computed(() => route.params.id as string)
const isNew = computed(() => bankDetailId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<BankDetailData>({
    validationSchema: BankDetailSchema,
    initialValues:    defaultState(),
})

const [entrepreneurNameModel] = defineLazyField("entrepreneur_name")
const [innModel] = defineLazyField("inn")
const [checkingAccountModel] = defineLazyField("checking_account")
const [bankNameModel] = defineLazyField("bank_name")
const [bikModel] = defineLazyField("bik")
const [correspondentAccountModel] = defineLazyField("correspondent_account")
const [userIdModel] = defineLazyField("user_id")
const [partnerIdModel] = defineLazyField("partner_id")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        bankDetailData,
        partnersData,
        usersData,
    ] = await Promise.all([
        !isNew.value ? bankDetailsAPI.get(bankDetailId.value) : null,
        partnersAPI.options(),
        usersAPI.options(),
    ])

    if (
        bankDetailData instanceof HttpError ||
        partnersData instanceof HttpError ||
        usersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (bankDetailData) {
        const bankDetail = bankDetailData.data

        resetForm({
            values: {
                entrepreneur_name:     bankDetail.entrepreneur_name,
                inn:                   bankDetail.inn,
                checking_account:      bankDetail.checking_account,
                bank_name:             bankDetail.bank_name,
                bik:                   bankDetail.bik,
                correspondent_account: bankDetail.correspondent_account,
                user_id:               bankDetail.user_id,
                partner_id:            bankDetail.partner_id,
            },
        })
    }

    partnerOptions.value = partnersData.list
    userOptions.value = usersData.list

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardBankDetails })
        return
    }

    isLoading.value = true

    const [bankDetailResponse] = await Promise.all([
        isNew.value
            ? bankDetailsAPI.create(formValues)
            : bankDetailsAPI.update(bankDetailId.value, formValues),
    ])

    isLoading.value = false

    if (bankDetailResponse instanceof HttpError) {
        if (bankDetailResponse?.errors) setErrors(bankDetailResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.bankDetail.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardBankDetails,
    })
})

const onRemove = async () => {
    isLoading.value = true

    const bankDetailResponse = await bankDetailsAPI.remove(bankDetailId.value)

    if (bankDetailResponse instanceof HttpError) {
        if (bankDetailResponse?.errors) setErrors(bankDetailResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.remove"))

    await router.push({
        name: DashboardRouteName.DashboardPromoDialogs,
    })
}

const title = computed(() => {
    return entrepreneurNameModel.value || `#${bankDetailId.value}`
})

function onDaDataPartySelect(data: PartyData) {
    entrepreneurNameModel.value = data.name
    innModel.value = data.inn
}

function onDaDataBankSelect(data: BankData) {
    bankNameModel.value = data.name
    bikModel.value = data.bic
    correspondentAccountModel.value = data.correspondent_account
}
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание реквизиты банка'
            : 'Редактирование реквизиты банка'"
        :path-back="dashboardPaths.DashboardBankDetails"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        :remove-text="!isNew
            ? 'Удалить реквизиты банка'
            : ''"
        class="bank-detail-view"
        @save="onSave"
        @remove="isShowRemoveDialog = true"
    >
        <b-form-card title="Данные компании">
            <b-form-item
                label="ФИО предпринимателя"
                required
            >
                <div class="entrepreneur-name-wrapper">
                    <b-input-text
                        v-model="entrepreneurNameModel"
                        :disabled="isLoading"
                        :maxlength="255"
                        :error="errors['entrepreneur_name']"
                    />

                    <b-button-secondary
                        v-if="!isFirstLoading"
                        label="Поиск компании"
                        icon="pi pi-database"
                        :disabled="isLoading"
                        @click="isDaDataPartyDialogVisible = true"
                    />
                </div>
            </b-form-item>

            <b-form-item label="ИНН">
                <b-input-text
                    v-model="innModel"
                    :disabled="isLoading"
                    :maxlength="12"
                    :error="errors['inn']"
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Данные банка">
            <b-form-item
                label="Наименование банка"
                required
            >
                <div class="bank-name-wrapper">
                    <b-input-text
                        v-model="bankNameModel"
                        :disabled="isLoading"
                        :maxlength="255"
                        :error="errors['bank_name']"
                    />

                    <b-button-secondary
                        v-if="!isFirstLoading"
                        label="Поиск банка"
                        icon="pi pi-database"
                        :disabled="isLoading"
                        @click="isDaDataBankDialogVisible = true"
                    />
                </div>
            </b-form-item>

            <b-form-item label="Расчётный счёт">
                <b-input-text
                    v-model="checkingAccountModel"
                    :disabled="isLoading"
                    :maxlength="20"
                    :error="errors['checking_account']"
                />
            </b-form-item>

            <b-form-item label="БИК">
                <b-input-text
                    v-model="bikModel"
                    :disabled="isLoading"
                    :maxlength="9"
                    :error="errors['bik']"
                />
            </b-form-item>

            <b-form-item label="Корреспондентский счёт">
                <b-input-text
                    v-model="correspondentAccountModel"
                    :disabled="isLoading"
                    :maxlength="20"
                    :error="errors['correspondent_account']"
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Назначение">
            <b-form-item label="Пользователь">
                <b-select
                    v-model="userIdModel"
                    :disabled="isLoading"
                    :options="userOptions"
                    :error="errors['user_id']"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                />
            </b-form-item>

            <b-form-item label="Филиал">
                <b-select
                    v-model="partnerIdModel"
                    :disabled="isLoading"
                    :options="partnerOptions"
                    :error="errors['partner_id']"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                />
            </b-form-item>
        </b-form-card>

        <b-dialog-remove
            v-model="isShowRemoveDialog"
            :is-loading="isLoading"
            @confirm="onRemove"
            @cancel="isShowRemoveDialog = false"
        >
            <p> Вы действительно хотите удалить реквизиты банка <b>{{ title }}</b>? </p>
        </b-dialog-remove>

        <dadata-party-dialog
            v-model="isDaDataPartyDialogVisible"
            @select="onDaDataPartySelect"
        />

        <dadata-bank-dialog
            v-model="isDaDataBankDialogVisible"
            @select="onDaDataBankSelect"
        />
    </b-form>
</template>

<style scoped lang="scss">
.bank-detail-view {
    .bank-name-wrapper,
    .entrepreneur-name-wrapper {
        display: flex;
        align-items: flex-start;
        gap: $indent-x1;
    }
}

</style>
