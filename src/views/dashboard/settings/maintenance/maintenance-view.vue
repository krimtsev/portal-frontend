<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useMaintenanceStore } from "@s/maintenance/maintenance"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as maintenanceAPI from "@/api/modules/dashboard/maintenance/maintenance"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import type { MaintenanceData } from "@v/dashboard/settings/maintenance/definitions/maintenance"
import { MaintenanceSchema } from "@v/dashboard/settings/maintenance/schemas/maintenance.schema"
import { maintenanceStateOptions } from "@v/dashboard/settings/maintenance/utils/maintenance"
import { Status } from "@/definitions/status"

const notify = useNotify()
const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const { t } = useI18n()


function defaultState(): MaintenanceData {
    return {
        enabled: false,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<MaintenanceData>({
    validationSchema: MaintenanceSchema,
    initialValues:    defaultState(),
})

const [enabledModel] = defineLazyField("enabled")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        maintenanceResponse,
    ] = await Promise.all([
        maintenanceAPI.get(),
    ])

    if (maintenanceResponse instanceof HttpError) {
        notify.error()
        return
    }

    const data = maintenanceResponse.data

    resetForm({
        values: {
            enabled: data.enabled,
        },
    })

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardSettings })
        return
    }

    isLoading.value = true

    const [
        maintenanceResponse,
    ] = await Promise.all([
        maintenanceAPI.update(formValues),
    ])

    isLoading.value = false

    if (maintenanceResponse instanceof HttpError) {
        if (maintenanceResponse?.errors) setErrors(maintenanceResponse.errors)
        notify.error()
        return
    }

    maintenanceStore.setMaintenanceData({
        enabled: formValues.enabled,
    })

    notify.success(t("mc.notify.success"))

    await router.push({ name: DashboardRouteName.DashboardSettings })
})

const maintenanceState = computed({
    get() {
        return enabledModel.value
            ? Status.ACTIVE
            : Status.DISABLED
    },
    set(newValue: Status) {
        enabledModel.value = newValue === Status.ACTIVE
    },
})
</script>

<template>
    <b-form
        title="Настройка домена"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        :path-back="dashboardPaths.DashboardSettings"
        class="maintenance-view"
        @save="onSave"
    >
        <b-form-card title="Основные настройки">
            <b-form-item
                label="Технические работы"
                class="label-align-center"
            >
                <b-select-button
                    v-model="maintenanceState"
                    :options="maintenanceStateOptions"
                    :error="errors['enabled']"
                    option-label="name"
                    option-value="id"
                    :option-class="{
                        [Status.DISABLED]: 'status-disabled',
                    }"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style scoped lang="scss">
.maintenance-view {}
</style>
