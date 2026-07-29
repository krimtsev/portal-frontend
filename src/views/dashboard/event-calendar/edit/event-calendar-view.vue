<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { DateTime } from "luxon"
import { useDepartmentStore } from "@s/department/department"
import { useNotify } from "@/composables/notify/use-notify.ts"
import { useVeeForm } from "@/composables/vee-validate/use-validation.ts"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as eventCalendarAPI from "@/api/modules/dashboard/event-calendar/event-calendar"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BDialogRemove from "@c/common/b-dialog/b-dialog-remove.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import { defaultMaxRows } from "@c/common/b-textarea/definitions/textarea.ts"
import type { EventCalendarData } from "@v/dashboard/event-calendar/edit/definitions/event-calendar"
import { EventCalendarSchema } from "@v/dashboard/event-calendar/edit/schemas/event-calendar.schema.ts"
import type { UserOptionItem } from "@v/dashboard/users/edit/definitions/user"
import {
    formatJSDateToStringDate,
    formatStringDateToJSDate,
} from "@/lib/date-helpers"
import { DB_DATE_FORMAT } from "@/constants/datetime"
import { maxDescriptionLength } from "@/constants/messages"


const notify = useNotify()
const route = useRoute()
const router = useRouter()

const departmentStore = useDepartmentStore()

const { t } = useI18n()

function defaultState(): EventCalendarData {
    const date = DateTime.local({ zone: "utc" })
        .toFormat(DB_DATE_FORMAT)

    return {
        title:                "",
        description:          "",
        start_at:             date,
        end_at:               date,
        department_id:        null,
        responsible_user_ids: [],
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isShowRemoveDialog = ref(false)
const userOptions = ref<UserOptionItem[]>([])

const batchId = computed(() => route.params.id as string)
const isNew = computed(() => batchId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<EventCalendarData>({
    validationSchema: EventCalendarSchema,
    initialValues:    defaultState(),
})

const [titleModel] = defineLazyField("title")
const [descriptionModel] = defineLazyField("description")
const [startAtModel] = defineLazyField("start_at")
const [endAtModel] = defineLazyField("end_at")
const [departmentIdModel] = defineLazyField("department_id")
const [responsibleUserIdsModel] = defineLazyField("responsible_user_ids")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        eventCalendarResponse,
        userOptionsResponse,
    ] = await Promise.all([
        !isNew.value
            ? eventCalendarAPI.get(batchId.value)
            : null,
        usersAPI.options(),
    ])

    if (
        eventCalendarResponse instanceof HttpError ||
        userOptionsResponse instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (eventCalendarResponse) {
        const data = eventCalendarResponse.data
        resetForm({
            values: {
                title:                data.title,
                description:          data.description || "",
                start_at:             data.start_at,
                end_at:               data.end_at,
                department_id:        data.department_id,
                responsible_user_ids: data.responsible_user_ids,
            },
        })
    }

    userOptions.value = userOptionsResponse.list

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardEventCalendarList })
        return
    }

    isLoading.value = true

    const [eventCalendarResponse] = await Promise.all([
        isNew.value
            ? eventCalendarAPI.create(formValues)
            : eventCalendarAPI.update(batchId.value, formValues),
    ])

    isLoading.value = false

    if (eventCalendarResponse instanceof HttpError) {
        if (eventCalendarResponse?.errors) setErrors(eventCalendarResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.eventCalendar.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardEventCalendarList,
    })
})

const startAt = computed({
    get() {
        return formatStringDateToJSDate(startAtModel.value)
    },
    set(date: Date) {
        startAtModel.value = formatJSDateToStringDate(date)
    },
})

const endAt = computed({
    get() {
        return formatStringDateToJSDate(endAtModel.value)
    },
    set(date: Date) {
        endAtModel.value = formatJSDateToStringDate(date)
    },
})

const onRemove = async () => {
    isLoading.value = true

    const eventCalendarResponse = await eventCalendarAPI.remove(batchId.value)

    if (eventCalendarResponse instanceof HttpError) {
        if (eventCalendarResponse?.errors) setErrors(eventCalendarResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.notify.remove"))

    await router.push({
        name: DashboardRouteName.DashboardEventCalendarList,
    })
}

const descriptionRows = computed(() => {
    return defaultMaxRows * 3
})
</script>

<template>
    <b-form
        :title="isNew
            ? 'Добавление события'
            : 'Редактирование события'"
        :remove-text="!isNew
            ? 'Удалить событие'
            : ''"
        :path-back="dashboardPaths.DashboardEventCalendarList"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="event-calendar-view"
        @save="onSave"
        @remove="isShowRemoveDialog = true"
    >
        <b-form-card title="Основные данные">
            <b-form-item
                label="Тема"
                required
            >
                <b-input-text
                    v-model="titleModel"
                    :disabled="isLoading"
                    :error="errors['title']"
                />
            </b-form-item>

            <b-form-item label="Описание">
                <b-textarea
                    v-model="descriptionModel"
                    :disabled="isLoading"
                    :error="errors['description']"
                    :maxlength="maxDescriptionLength"
                    :rows="descriptionRows"
                    class="full-width"
                />
            </b-form-item>

            <b-form-item
                label="Дата начала"
                required
            >
                <b-date-picker
                    v-model="startAt"
                    :disabled="isLoading"
                    :error="errors['start_at']"
                />
            </b-form-item>

            <b-form-item
                label="Дата окончания"
                required
            >
                <b-date-picker
                    v-model="endAt"
                    :disabled="isLoading"
                    :error="errors['end_at']"
                />
            </b-form-item>

            <b-form-item label="Отдел">
                <b-select
                    v-model="departmentIdModel"
                    :options="departmentStore.options"
                    :disabled="isLoading"
                    :error="errors['department_id']"
                    option-label="title"
                    option-value="id"
                    show-clear
                />
            </b-form-item>

            <b-form-item label="Ответственные">
                <b-multi-select
                    v-model="responsibleUserIdsModel"
                    :disabled="isLoading"
                    :options="userOptions"
                    :error="errors['responsible_user_ids']"
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
            <p> Вы действительно хотите удалить событие <b>"{{ titleModel }}"</b>? </p>
        </b-dialog-remove>
    </b-form>
</template>

<style scoped lang="scss">
.event-calendar-view {}
</style>
