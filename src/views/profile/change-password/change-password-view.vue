<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useAuthStore } from "@s/auth/auth"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import * as changePasswordAPI from "@/api/modules/profile/change-password/change-password"
import type { ChangePassword } from "@/api/modules/profile/change-password/definitions/change-password"
import BInputPassword from "@c/common/b-input/b-input-password.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalFormItem from "@c/portal/portal-form-item/portal-form-item.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { UserPasswordSchema } from "@v/profile/change-password/schemas/change-password.schema"


const { t } = useI18n()
const notify = useNotify()
const authStore = useAuthStore()
const router = useRouter()

function defaultState(): ChangePassword {
    return {
        password:        "",
        confirmPassword: "",
    }
}

const isLoading = ref(false)

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<ChangePassword>({
    validationSchema: UserPasswordSchema,
    initialValues:    defaultState(),
})

const [passwordModel] = defineLazyField("password")
const [confirmPasswordModel] = defineLazyField("confirmPassword")

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: ProfileRouteName.Profile })
        return
    }

    isLoading.value = true

    const resp = await changePasswordAPI.change(formValues)

    isLoading.value = false

    if (resp instanceof HttpError) {
        if (resp?.errors) setErrors(resp.errors)
        notify.error()
        return
    }

    notify.success("Пароль изменен")
    await authStore.logout()
})

const onCancel = async () => {
    await router.push({ name: ProfileRouteName.Profile })
}

const passwordError = computed(() => errors.value.password || errors.value.confirmPassword)
const hasPasswordError = computed(() => !!(errors.value.password || errors.value.confirmPassword))
</script>

<template>
    <portal-page
        title="Смена пароля"
        class="change-password-view"
        :is-submitting="isLoading"
        @save="onSave"
        @cancel="onCancel"
    >
        <portal-card mobile-wrap-form>
            <portal-form-item label="Введите новый пароль">
                <b-input-password
                    v-model="passwordModel"
                    :placeholder="t('mc.placeholder.input')"
                    :invalid="hasPasswordError"
                    :disabled="isLoading"
                    hint="Пароль может состоять из букв, цифр и быть строкой без пробелов."
                />
            </portal-form-item>

            <portal-form-item label="Введите пароль еще раз">
                <b-input-password
                    v-model="confirmPasswordModel"
                    :placeholder="t('mc.placeholder.input')"
                    :error="passwordError"
                    :disabled="isLoading"
                />
            </portal-form-item>
        </portal-card>
    </portal-page>
</template>

