<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as promoDialogsAPI from "@/api/modules/dashboard/promo-dialogs/promo-dialogs"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import type { PromoDialogData } from "@v/dashboard/promo-dialogs/edit/definitions/promo-dialog"
import { PromoDialogSchema } from "@v/dashboard/promo-dialogs/edit/schemas/promo-dialog.schema"
import { controlOptions } from "@/constants/controls"
import { maxMessageLength, maxTitleLength } from "@/constants/messages"
import { Status } from "@/definitions/status"


const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): PromoDialogData {
    return {
        title:       "",
        description: "",
        template:    null,
        disabled:    true,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isShowRemoveDialog = ref(false)

const promoDialogId = computed(() => route.params.id as string)
const isNew = computed(() => promoDialogId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<PromoDialogData>({
    validationSchema: PromoDialogSchema,
    initialValues:    defaultState(),
})

const [titleModel] = defineLazyField("title")
const [descriptionModel] = defineLazyField("description")
const [disabledModel] = defineLazyField("disabled")
const [templateModel] = defineLazyField("template")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        promoDialogData,
    ] = await Promise.all([
        !isNew.value ? promoDialogsAPI.get(promoDialogId.value) : null,
    ])

    if (promoDialogData instanceof HttpError) {
        notify.error()
        return
    }

    if (promoDialogData) {
        const promoDialog = promoDialogData.data

        resetForm({
            values: {
                title:       promoDialog.title,
                description: promoDialog.description,
                disabled:    promoDialog.disabled,
                template:    promoDialog.template,
            },
        })
    }

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardPromoDialogs })
        return
    }

    isLoading.value = true

    const [promoDialogResponse] = await Promise.all([
        isNew.value
            ? promoDialogsAPI.create(formValues)
            : promoDialogsAPI.update(promoDialogId.value, formValues),
    ])

    isLoading.value = false

    if (promoDialogResponse instanceof HttpError) {
        if (promoDialogResponse?.errors) setErrors(promoDialogResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.promoDialog.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardPromoDialogs,
    })
})

const promoDialogState = computed({
    get() {
        return disabledModel.value
            ? Status.DISABLED
            : Status.ACTIVE
    },
    set(newValue: Status) {
        disabledModel.value = newValue === Status.DISABLED
    },
})

const onRemove = async () => {
    isLoading.value = true

    const promoDialogResponse = await promoDialogsAPI.remove(promoDialogId.value)

    if (promoDialogResponse instanceof HttpError) {
        if (promoDialogResponse?.errors) setErrors(promoDialogResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.remove"))

    await router.push({
        name: DashboardRouteName.DashboardPromoDialogs,
    })
}
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание промо-диалога'
            : 'Редактирование промо-диалога'"
        :path-back="dashboardPaths.DashboardPromoDialogs"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        :remove-text="!isNew && !templateModel
            ? 'Удалить промо-диалог'
            : ''"
        class="promo-dialog-view"
        @save="onSave"
        @remove="isShowRemoveDialog = true"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Название диалога"
                required
            >
                <b-input-text
                    v-model="titleModel"
                    :disabled="isLoading"
                    :maxlength="maxTitleLength"
                    :error="errors['title']"
                />
            </b-form-item>

            <b-form-item label="Описание">
                <b-textarea
                    v-model="descriptionModel"
                    :disabled="isLoading"
                    :error="errors['description']"
                    :maxlength="maxMessageLength"
                    class="full-width"
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                class="label-align-center"
            >
                <b-select-button
                    v-model="promoDialogState"
                    :disabled="isLoading"
                    :options="controlOptions"
                    :error="errors['disabled']"
                    option-label="name"
                    option-value="id"
                    :option-class="{
                        [Status.DISABLED]: 'status-danger',
                    }"
                />
            </b-form-item>
        </b-form-card>

        <b-dialog-remove
            v-model="isShowRemoveDialog"
            :is-loading="isLoading"
            @confirm="onRemove"
            @cancel="isShowRemoveDialog = false"
        >
            <p> Вы действительно хотите удалить промо-диалог <b>{{ titleModel }}</b>? </p>
        </b-dialog-remove>
    </b-form>
</template>
