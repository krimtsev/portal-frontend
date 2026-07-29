<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useAppStore } from "@s/app/app"
import { useAuthStore } from "@s/auth/auth"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { portalPaths } from "@r/portal/path"
import { HttpError } from "@/api"
import type { LoginCredentials } from "@/api/modules/auth/definitions/auth"
import BButton from "@c/common/b-button/b-button.vue"
import BCheckbox from "@c/common/b-checkbox/b-checkbox.vue"
import BImage from "@c/common/b-image/b-image.vue"
import BInputPassword from "@c/common/b-input/b-input-password.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSpinner from "@c/common/b-spinner/b-spinner.vue"
import { AuthSchema } from "@v/auth/schemas/auth.schema"


const { t } = useI18n()
const authStore = useAuthStore()
const appStore = useAppStore()
const notify = useNotify()
const router = useRouter()
const route = useRoute()

function defaultState(): LoginCredentials {
    return {
        login:    "",
        password: "",
        remember: false,
    }
}

const {
    errors,
    handleSubmit,
    defineLazyField,
} = useVeeForm<LoginCredentials>({
    validationSchema: AuthSchema,
    initialValues:    defaultState(),
})

const [loginModel] = defineLazyField("login")
const [passwordModel] = defineLazyField("password")
const [rememberModel] = defineLazyField("remember")

const redirectPath = computed(() => (route.query.redirect as string) || portalPaths.Home)

const onSave = handleSubmit(async (formValues) => {
    const response = await authStore.login(formValues)

    if (response instanceof HttpError) {
        notify.error(response?.message)
        return
    }

    await router.push(redirectPath.value)
})

onMounted(async () => {
    if (authStore.isLoading) {
        const success = await authStore.auth()

        if (success) {
            await router.replace(redirectPath.value)
        }
    }

    appStore.setLoading(false)
})
</script>

<template>
    <div class="auth-view">
        <div class="logo">
            <b-image src="logos/logo.png" width="80px" />
        </div>

        <div class="wrapper">
            <div class="form">
                <b-image src="logos/logo-large.png" width="100%" />

                <div class="form-card">
                    <template v-if="!appStore.isLoading">
                        <b-input-text
                            v-model="loginModel"
                            :placeholder="t('mc.common.login')"
                            :error="errors['login']"
                            :disabled="authStore.isLoading"
                            class="full-width"
                        />

                        <b-input-password
                            v-model="passwordModel"
                            :placeholder="t('mc.common.password')"
                            :error="errors['password']"
                            :disabled="authStore.isLoading"
                            class="full-width"
                        />

                        <div class="flex-center">
                            <b-checkbox
                                v-model="rememberModel"
                                :label="t('mc.common.remember')"
                                :disabled="authStore.isLoading"
                                class="checkbox"
                            />
                        </div>

                        <b-button
                            :label="t('mc.common.enter')"
                            :disabled="authStore.isLoading"
                            :is-loading="authStore.isLoading"
                            type="submit"
                            class="full-width"
                            @click="onSave"
                        />
                    </template>

                    <b-spinner v-else />
                </div>
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
            height: 218px;
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

