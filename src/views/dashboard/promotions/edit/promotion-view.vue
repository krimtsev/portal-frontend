<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as promotionsAPI from "@/api/modules/dashboard/promotions/promotions"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import BEditor from "@c/common/b-editor/b-editor.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BImageUpload from "@c/common/b-image-upload/b-image-upload.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import { defaultMaxRows } from "@c/common/b-textarea/definitions/textarea"
import type { PromotionFormData } from "@v/dashboard/promotions/edit/definitions/promotion"
import { PromotionSchema } from "@v/dashboard/promotions/edit/schemas/promotion.schema"
import { formatJSDateToStringDate, formatStringDateToJSDate } from "@/lib/date-helpers"
import { $sanitizeEditorHtml } from "@/lib/sanitize-html"
import { controlOptions } from "@/constants/controls"
import { maxMessageLength, maxTitleLength } from "@/constants/messages"
import { Status } from "@/definitions/status"

const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): PromotionFormData {
    return {
        title:        "",
        description:  "",
        expires_at:   null,
        disabled:     true,
        image:        null,
        remove_image: false,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isShowRemoveDialog = ref(false)

const promotionId = computed(() => route.params.id as string)
const isNew = computed(() => promotionId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<PromotionFormData>({
    validationSchema: PromotionSchema,
    initialValues:    defaultState(),
})

const [titleModel] = defineLazyField("title")
const [descriptionModel] = defineLazyField("description")
const [disabledModel] = defineLazyField("disabled")
const [expiresAtModel] = defineLazyField("expires_at")
const [imageModel] = defineLazyField("image")
const [removeImageModel] = defineLazyField("remove_image")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        promotionData,
    ] = await Promise.all([
        !isNew.value ? promotionsAPI.get(promotionId.value) : null,
    ])

    if (promotionData instanceof HttpError) {
        notify.error()
        return
    }

    if (promotionData) {
        const promotion = promotionData.data

        resetForm({
            values: {
                title:        promotion.title,
                description:  promotion.description,
                disabled:     promotion.disabled,
                expires_at:   promotion.expires_at,
                image:        null,
                remove_image: false,
            },
        })

        if (promotion.image) {
            serverImageUrl.value = promotion.image
        }
    }

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardPromotions })
        return
    }

    isLoading.value = true

    const payload = {
        ...formValues,
        description: $sanitizeEditorHtml(formValues.description ?? ""),
    }

    const [promotionResponse] = await Promise.all([
        isNew.value
            ? promotionsAPI.create(payload)
            : promotionsAPI.update(promotionId.value, payload),
    ])

    isLoading.value = false

    if (promotionResponse instanceof HttpError) {
        if (promotionResponse?.errors) setErrors(promotionResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.promotion.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardPromotions,
    })
})

const promotionState = computed({
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

    const promotionResponse = await promotionsAPI.remove(promotionId.value)

    if (promotionResponse instanceof HttpError) {
        if (promotionResponse?.errors) setErrors(promotionResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.remove"))

    await router.push({
        name: DashboardRouteName.DashboardPromotions,
    })
}

const serverImageUrl = ref<string | null>(null)
const effectiveServerUrl = computed<string | null>(() => {
    return removeImageModel.value
        ? null
        : serverImageUrl.value
})

watch(imageModel, (file) => {
    if (file) removeImageModel.value = false
})

const descriptionRows = computed(() => defaultMaxRows * 2)

const expiresAt = computed({
    get() {
        return formatStringDateToJSDate(expiresAtModel.value)
    },
    set(date: Date) {
        expiresAtModel.value = formatJSDateToStringDate(date)
    },
})
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание промо-акции'
            : 'Редактирование промо-акции'"
        :path-back="dashboardPaths.DashboardPromotions"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        :remove-text="!isNew
            ? 'Удалить промо-акцию'
            : ''"
        class="promotion-view"
        @save="onSave"
        @remove="isShowRemoveDialog = true"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Название акции"
                required
            >
                <b-input-text
                    v-model="titleModel"
                    :disabled="isLoading"
                    :maxlength="maxTitleLength"
                    :error="errors['title']"
                />
            </b-form-item>

            <b-form-item
                label="Описание"
                required
            >
                <b-editor
                    v-model="descriptionModel"
                    :disabled="isLoading"
                    :error="errors['description']"
                    :maxlength="maxMessageLength"
                    :rows="descriptionRows"
                    hide-count
                    class="full-width"
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                class="label-align-center"
            >
                <b-select-button
                    v-model="promotionState"
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

            <b-form-item
                label="Дата окончания"
                class="label-align-center"
            >
                <b-date-picker
                    v-model="expiresAt"
                    :disabled="isLoading"
                    :error="errors['expires_at']"
                    :placeholder="t('mc.common.placeholder.period')"
                    show-clear
                    class="filter-expires-at"
                />
            </b-form-item>

            <b-form-item label="Изображение">
                <b-image-upload
                    v-model="imageModel"
                    :server-url="effectiveServerUrl"
                    :error="errors['image']"
                    :disabled="isLoading"
                    @remove="removeImageModel = true"
                    class="image full-width"
                />
            </b-form-item>
        </b-form-card>

        <b-dialog-remove
            v-model="isShowRemoveDialog"
            :is-loading="isLoading"
            @confirm="onRemove"
            @cancel="isShowRemoveDialog = false"
        >
            <p> Вы действительно хотите удалить промо-акцию <b>{{ titleModel }}</b>? </p>
        </b-dialog-remove>
    </b-form>
</template>
