<script setup lang="ts">
import { reactive, ref } from "vue"
import { Form } from "@primevue/forms"
import type { FormResolverOptions, FormSubmitEvent } from "@primevue/forms"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalFormItem from "@c/portal/portal-form-item/portal-form-item.vue"
import BInputPassword from "@c/common/b-input-password/b-input-password.vue"
import { useI18n } from "vue-i18n"
import { HttpError } from "@/api"
import * as changePasswordAPI from "@/api/modules/profile/change-password/change-password"
import type { ChangePassword } from "@/api/modules/profile/change-password/definitions/change-password"
import { useNotify } from "@/composables/notify/use-notify"
import { isPassword } from "@/lib/validator"
import useAuthStore from "@s/auth/auth"


const { t } = useI18n()
const notify = useNotify()
const authStore = useAuthStore()

const initialValues = reactive<ChangePassword>({
    password: "",
    confirmPassword: "",
})

const isSubmitting = ref(false)

async function resolver(options: FormResolverOptions) {
    const { password, confirmPassword } = options.values

    const errors: {
        confirmPassword?: Array<{ message: string }>
    } = {}

    if (!confirmPassword) {
        errors.confirmPassword = [{ message: "Введите пароль." }]
    } else if (!isPassword(confirmPassword)) {
        errors.confirmPassword = [{ message: "Пароль может состоять из букв, цифр и быть строкой без пробелов." }]
    } else if (confirmPassword.length < 8) {
        errors.confirmPassword = [{ message: "Пароль должен содержать не менее 8 символов." }]
    } else if (confirmPassword !== password) {
        errors.confirmPassword = [{ message: "Пароли не совпадают." }]
    }

    return {
        values: options.values,
        errors
    }
}

async function onFormSubmit(event: FormSubmitEvent): Promise<void> {
    if (!event.valid || isSubmitting.value) return

    isSubmitting.value = true

    const values = event.values as ChangePassword
    const resp = await changePasswordAPI.change(values)

    isSubmitting.value = false

    if (resp instanceof HttpError) {
        notify.error()
        return
    }

    notify.success("Пароль изменен")
    await authStore.logout()

}
</script>

<template>
    <Form
        v-slot="$form"
        :resolver="resolver"
        :initial-values="initialValues"
        @submit="onFormSubmit"
        class="form-card"
    >
        <portal-page
            title="Смена пароля"
            class="change-password-view"
            :is-submitting="isSubmitting"
            @save="() => $form.triggerSubmit"
        >
            <portal-card mobile-wrap-form>
                <portal-form-item label="Введите новый пароль">
                    <b-input-password
                        name="password"
                        :placeholder="t('mc.placeholder.input')"
                        :invalid="$form.confirmPassword?.invalid"
                        :disabled="isSubmitting"
                        hint="Пароль может состоять из букв, цифр и быть строкой без пробелов."
                    />
                </portal-form-item>

                <portal-form-item label="Введите пароль еще раз">
                    <b-input-password
                        name="confirmPassword"
                        :placeholder="t('mc.placeholder.input')"
                        :error="$form.confirmPassword?.invalid
                            ? $form.confirmPassword.error?.message
                            : ''
                        "
                        :disabled="isSubmitting"
                    />
                </portal-form-item>
            </portal-card>
        </portal-page>
    </Form>
</template>

