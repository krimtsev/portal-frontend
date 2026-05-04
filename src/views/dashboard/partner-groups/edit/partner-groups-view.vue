<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnerGroupsAPI from "@/api/modules/dashboard/partners/partner-groups"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import type { PartnerGroupData } from "@v/dashboard/partner-groups/edit/definitions/partner-group"
import { PartnerGroupSchema } from "@v/dashboard/partner-groups/edit/schemas/partner-group.schema"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): PartnerGroupData {
    return {
        title:    "",
        partners: [],
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isShowRemoveDialog = ref(false)
const partners = ref<PartnerOptionItem[]>([])

const partnerId = computed(() => route.params.id as string)
const isNew = computed(() => partnerId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<PartnerGroupData>({
    validationSchema: PartnerGroupSchema,
    initialValues:    defaultState(),
})

const [titleModel] = defineLazyField("title")
const [partnersModel] = defineLazyField("partners")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnerGroupData,
        partnersData,
    ] = await Promise.all([
        !isNew.value ? partnerGroupsAPI.get(partnerId.value) : null,
        partnersAPI.options(),
    ])

    if (
        partnerGroupData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    partners.value = partnersData.list

    if (partnerGroupData) {
        const partnerGroup = partnerGroupData.data

        resetForm({
            values: {
                title:    partnerGroup.title,
                partners: partnerGroup.partners,
            },
        })
    }

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardPartnerGroups })
        return
    }

    isLoading.value = true

    const [partnerResponse] = await Promise.all([
        isNew.value
            ? partnerGroupsAPI.create(partnerId.value, formValues)
            : partnerGroupsAPI.update(partnerId.value, formValues),
    ])

    isLoading.value = false

    if (partnerResponse instanceof HttpError) {
        if (partnerResponse?.errors) setErrors(partnerResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.partnerGroup.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardPartnerGroups,
    })
})

const onRemove = async () => {
    isLoading.value = true

    const partnerResponse = await partnerGroupsAPI.remove(partnerId.value)

    if (partnerResponse instanceof HttpError) {
        if (partnerResponse?.errors) setErrors(partnerResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.remove"))

    await router.push({
        name: DashboardRouteName.DashboardPartnerGroups,
    })
}
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание группы'
            : 'Редактирование группы'"
        :path-back="dashboardPaths.DashboardPartnerGroups"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        :remove-text="!isNew
            ? 'Удалить группу'
            : ''"
        class="user-view"
        @save="onSave"
        @remove="isShowRemoveDialog = true"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Название группы"
                required
            >
                <b-input-text
                    v-model="titleModel"
                    :disabled="isLoading"
                    :error="errors['title']"
                />
            </b-form-item>

            <b-form-item label="Партнеры">
                <b-multi-select
                    v-model="partnersModel"
                    :disabled="isLoading"
                    :error="errors['partners']"
                    :options="partners"
                    filter
                    sort-by-selected
                    option-label="name"
                    option-value="id"
                />
            </b-form-item>
        </b-form-card>
    </b-form>

    <b-dialog-remove
        v-model="isShowRemoveDialog"
        :is-loading="isLoading"
        @confirm="onRemove"
        @cancel="isShowRemoveDialog = false"
    >
        <p> Вы действительно хотите удалить группу <b>{{ titleModel }}</b>? </p>
    </b-dialog-remove>
</template>
