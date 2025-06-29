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
import useAuthStore from "~/src/store/auth/auth"

const { t } = useI18n()
const authStore = useAuthStore()

interface Auth {
    login: string
    password: string
    remember: boolean
}

const initialValues = reactive<Auth>({
    login: "ice",
    password: "WwK6K2jqPPDwVgp",
    remember: false
});

async function resolver(options: FormResolverOptions) {
    const values = options.values
    const errors: {
        login?: Array<{ message: string }>;
        password?: Array<{ message: string }>;
    } = {};

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
    const values = event.values as Auth
    await authStore.csrf()
    await authStore.login(values)
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
                        name="login"
                    />

                    <b-input-password
                        :placeholder="t('mc.common.password')"
                        :error="$form.password?.invalid
                            ? $form.password.error?.message
                            : ''
                        "
                        name="password"
                        label-colon
                    />

                    <div class="flex-center">
                        <b-checkbox
                            :label="t('mc.common.remember')"
                            name="remember"
                            class="checkbox"
                        />
                    </div>

                    <b-button
                        :label="t('mc.common.enter')"
                        width-full
                        type="submit"
                    />
                </Form>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$gradient-color-1: var(--p-form-field-background); // #0A0A0A
$gradient-color-2: var(--p-primary-500); // #63A408
$gradient-color-3: var(--p-primary-200); // #E4FF46

.auth-view {
    @include flex-center;

    flex-direction: column;
    width: 100%;
    padding: $indent-x2;

    .wrapper {
        @include flex-center;

        width: 100%;
        height: 100%;
        background: radial-gradient(104.99% 104.99% at 50% 101.58%, $gradient-color-1 60%, $gradient-color-2 84.89%, $gradient-color-3 100%);
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

