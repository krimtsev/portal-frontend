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
            <b-image src="logos/logo.svg" height="46px" />
        </div>

        <div class="wrapper">
            <div class="form">
                <div class="form-logo">
                    <b-image
                        src="logos/logo-auth.png"
                        width="100%"
                    />
                </div>

                <div class="form-card">
                    <template v-if="!appStore.isLoading">
                        <b-input-text
                            v-model="loginModel"
                            :placeholder="t('mc.common.login')"
                            :error="errors['login']"
                            :disabled="authStore.isLoading"
                            class="full-width input"
                        />

                        <b-input-password
                            v-model="passwordModel"
                            :placeholder="t('mc.common.password')"
                            :error="errors['password']"
                            :disabled="authStore.isLoading"
                            class="full-width input"
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 398px;
        height: 100%;
        padding-top: $indent-x4;

        &-logo {
            width: 398px;
            padding: 0 $indent-x4;

            @media (max-width: $breakpoints-xl) {
                width: calc(270px + (398 - 270) * ((100vw - #{$breakpoints-lg}) / (1600 - 1336)));
                margin: 0 auto;
            }

            @media (max-width: $breakpoints-lg) {
                width: 270px;
            }
        }

        &-card {
            width: 100%;
            min-height: 218px;
            display: flex;
            flex-direction: column;
            gap: $indent-x2;
            margin-top: 53px;
        }

        :deep(.input) {
            input::placeholder {
                color: var(--p-auth-input-placeholder-color);
            }
            input {
                background-color: var(--p-auth-input-background);
                border-color: var(--p-auth-input-border-color);

                &:hover {
                    border-color: var(--p-auth-input-hover-border-color);
                }
                &:focus {
                    border-color: var(--p-auth-input-focus-border-color);
                }
            }
        }

        :deep(.b-checkbox) {
            .label {
                color: var(--p-auth-checkbox-label-color);
            }
        }
    }

    .logo {
        height: 46px;
        margin-bottom: $indent-x2;
    }

    .checkbox {
        margin: $indent-x2 0;
    }
}
</style>

