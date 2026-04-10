<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useForm } from "vee-validate"
import { PartnerSchema } from "@v/dashboard/partners/edit/schemas/partner.schema"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"
import type { PartnerData } from "@v/dashboard/partners/edit/definitions/partner"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as partnerGroupsAPI from "@/api/modules/dashboard/partners/partner-groups"
import { HttpError } from "@/api"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import { stateList } from "@v/dashboard/partners/list/utils/partners"
import type { PartnerGroupOptionItem } from "@v/dashboard/partner-groups/list/definitions/partner-groups"
import PartnerTelnums from "@v/dashboard/partners/edit/components/partner-telnums.vue"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): PartnerData {
    return {
        group_id:        null,
        organization:    "",
        inn:             "",
        ogrnip:          "",
        name:            "",
        contract_number: "",
        email:           "",
        yclients_id:     "",
        mango_telnum:    "",
        address:         "",
        start_at:        null,
        disabled:        true,
        telnums:         [],
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const partnerGroups = ref<PartnerGroupOptionItem[]>([])

const partnerId = computed(() => route.params.id as string)
const isNew = computed(() => partnerId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineField,
    meta,
    submitCount,
    setErrors,
} = useForm<PartnerData>({
    validationSchema: PartnerSchema,
    initialValues:    defaultState(),
})

const dynamicConfig = useConfigValidation(submitCount)

const [groupIdModel] = defineField("group_id", dynamicConfig)
const [organizationModel] = defineField("organization", dynamicConfig)
const [innModel] = defineField("inn", dynamicConfig)
const [ogrnipModel] = defineField("ogrnip", dynamicConfig)
const [nameModel] = defineField("name", dynamicConfig)
const [contractNumberModel] = defineField("contract_number", dynamicConfig)
const [emailModel] = defineField("email", dynamicConfig)
const [yclientsIdModel] = defineField("yclients_id", dynamicConfig)
const [mangoTelnumModel] = defineField("mango_telnum", dynamicConfig)
const [addressModel] = defineField("address", dynamicConfig)
const [startAtModel] = defineField("start_at", dynamicConfig)
const [disabledModel] = defineField("disabled", dynamicConfig)
const [telnumsModel] = defineField("telnums", dynamicConfig)

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnerData,
        partnerGroupsData,
    ] = await Promise.all([
        !isNew.value ? partnersAPI.get(partnerId.value) : null,
        partnerGroupsAPI.options(),
    ])

    if (
        partnerData instanceof HttpError ||
        partnerGroupsData instanceof HttpError
    ) {
        notify.error()
        return
    }

    partnerGroups.value = partnerGroupsData.list

    if (partnerData) {
        const partner = partnerData.data

        resetForm({
            values: {
                group_id:        partner.group_id || null,
                organization:    partner.organization,
                inn:             partner.inn,
                ogrnip:          partner.ogrnip,
                name:            partner.name,
                contract_number: partner.contract_number,
                email:           partner.email,
                yclients_id:     partner.yclients_id,
                mango_telnum:    partner.mango_telnum,
                address:         partner.address,
                start_at:        partner.start_at || null,
                disabled:        partner.disabled,
                telnums:         partner.telnums || [],
            },
        })
    }

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardPartners })
        return
    }

    isLoading.value = true

    const [partnerResponse] = await Promise.all([
        isNew.value
            ? partnersAPI.create(partnerId.value, formValues)
            : partnersAPI.update(partnerId.value, formValues),
    ])

    isLoading.value = false

    if (partnerResponse instanceof HttpError) {
        if (partnerResponse?.errors) setErrors(partnerResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.partners.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardPartners,
    })
})
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание филиала'
            : 'Редактирование филиала'"
        :path-back="dashboardPaths.DashboardPartners"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="user-view"
        @save="onSave"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Название филиала"
                required
            >
                <b-input-text
                    v-model="nameModel"
                    :disabled="isLoading"
                    :error="errors.name"
                />
            </b-form-item>

            <b-form-item label="Имя партнера">
                <b-input-text
                    v-model="organizationModel"
                    :disabled="isLoading"
                    :error="errors.organization"
                />
            </b-form-item>

            <b-form-item label="Номер договора">
                <b-input-text
                    v-model="contractNumberModel"
                    :disabled="isLoading"
                    :error="errors.contract_number"
                    :maxlength="50"
                />
            </b-form-item>

            <b-form-item label="ИНН">
                <b-input-text
                    v-model="innModel"
                    :disabled="isLoading"
                    :error="errors.inn"
                    :maxlength="12"
                />
            </b-form-item>

            <b-form-item label="ОГРНИП">
                <b-input-text
                    v-model="ogrnipModel"
                    :disabled="isLoading"
                    :error="errors.ogrnip"
                    :maxlength="15"
                />
            </b-form-item>

            <b-form-item label="Электронная почта">
                <b-input-text
                    v-model="emailModel"
                    :disabled="isLoading"
                    :error="errors.email"
                />
            </b-form-item>

            <b-form-item label="Адрес организации">
                <b-input-text
                    v-model="addressModel"
                    :disabled="isLoading"
                    :error="errors.address"
                />
            </b-form-item>

            <b-form-item label="Дата подписания">
                <b-date-picker
                    v-model="startAtModel"
                    :disabled="isLoading"
                    :error="errors.start_at"
                    update-model-type="string"
                    show-button-bar
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                class="label-align-center"
            >
                <b-select-button
                    v-model="disabledModel"
                    :disabled="isLoading"
                    :options="stateList"
                    :error="errors.disabled"
                    option-label="name"
                    option-value="id"
                />
            </b-form-item>

            <b-form-item label="Группа филиалов">
                <b-select
                    v-model="groupIdModel"
                    :disabled="isLoading"
                    :options="partnerGroups"
                    :error="errors.group_id"
                    option-label="title"
                    option-value="id"
                    filter
                    show-clear
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Контакты">
            <b-form-item label="Список контактов">
                <partner-telnums
                    v-model="telnumsModel"
                    :disabled="isLoading"
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Интеграции">
            <b-form-item label="Yclients ID">
                <b-input-text
                    v-model="yclientsIdModel"
                    :disabled="isLoading"
                    :error="errors.yclients_id"
                />
            </b-form-item>

            <b-form-item label="Mango телефон">
                <b-input-text
                    v-model="mangoTelnumModel"
                    :disabled="isLoading"
                    :error="errors.mango_telnum"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style scoped lang="scss">
.partner-view {

}
</style>
