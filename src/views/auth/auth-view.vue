<script setup lang="ts">
import { reactive } from "vue"
import { useI18n } from "vue-i18n"
import { Form } from "@primevue/forms"
import type { FormResolverOptions, FormSubmitEvent } from "@primevue/forms"
import BInputText from "@c/common/b-input-text/b-input-text.vue"
import BInputPassword from "@c/common/b-input-password/b-input-password.vue"
import BCheckbox from "@c/common/b-checkbox/b-checkbox.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BImage from "@c/common/b-image/b-image.vue"
import useAuthStore from "@s/auth/auth"
import { useNotify } from "@h/notify/notify"
import { HttpError } from "@/api"

const { t } = useI18n()
const authStore = useAuthStore()
const notify = useNotify()

interface Auth {
    login: string
    password: string
    remember: boolean
}

const initialValues = reactive<Auth>({
    login: "",
    password: "",
    remember: false
})

async function resolver(options: FormResolverOptions) {
    const values = options.values
    const errors: {
        login?: Array<{ message: string }>
        password?: Array<{ message: string }>
    } = {}

    if (!values.login) {
        errors.login = [{ message: t("mc.auth.errors.login") }]
    }

    if (!values.password) {
        errors.password = [{ message: t("mc.auth.errors.password") }]
    }

    return {
        values,
        errors
    }
}

async function onFormSubmit(event: FormSubmitEvent): Promise<void> {
    authStore.isLoading = true

    const values = event.values as Auth
    await authStore.csrf()
    const resp = await authStore.login(values)
    if (resp instanceof HttpError) {
        notify.error()
    }

    authStore.isLoading = false
}
</script>

<template>
    <div class="auth-view">
        <div class="logo">
            <b-image src="logos/logo.png" width="80px" />
        </div>

        <div class="wrapper">
            <div class="form">
                <b-image src="logos/logo-large.png" width="100%" />

                <Form
                    v-slot="$form"
                    :resolver="resolver"
                    :initial-values="initialValues"
                    @submit="onFormSubmit"
                    class="form-card"
                >
                    <b-input-text
                        :placeholder="t('mc.common.login')"
                        :error="$form.login?.invalid
                            ? $form.login.error?.message
                            : ''
                        "
                        :disabled="authStore.isLoading"
                        name="login"
                    />

                    <b-input-password
                        :placeholder="t('mc.common.password')"
                        :error="$form.password?.invalid
                            ? $form.password.error?.message
                            : ''
                        "
                        :disabled="authStore.isLoading"
                        name="password"
                        label-colon
                    />

                    <div class="flex-center">
                        <b-checkbox
                            :label="t('mc.common.remember')"
                            :disabled="authStore.isLoading"
                            name="remember"
                            class="checkbox"
                        />
                    </div>

                    <b-button
                        :label="t('mc.common.enter')"
                        width-full
                        type="submit"
                        :disabled="authStore.isLoading"
                        :loading="authStore.isLoading"
                    />
                </Form>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.auth-view {
    @include flex-center;

    flex-direction: column;
    width: 100%;
    padding: $indent-x2;

    .wrapper {
        @include flex-center;

        width: 100%;
        height: 100%;
        background: $partner-gradient;
        border-radius: $indent-x4;
        padding: $indent-x2;
    }

    .form {
        width: 398px;

        &-card {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-top: 25%;
            gap: $indent-x2;
        }
    }

    .logo {
        width: 80px;
        height: 46px;
        margin-bottom: $indent-x2;
    }

    .checkbox {
        margin: $indent-x2 0;
    }

}
</style>

