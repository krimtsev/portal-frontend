<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BInputPassword from "@c/common/b-input/b-input-password.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BToggleSwitch from "@c/common/b-toggle-switch/b-toggle-switch.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import type { UserData } from "@v/dashboard/users/edit/definitions/user"
import { Roles } from "@/shared/roles/roles"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import type { PartnerShortListItem } from "@v/dashboard/partners/list/definitions/partners"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import { HttpError } from "@/api"
import { generatePassword } from "@/lib/utils"
import { useForm } from "vee-validate"
import { userSchema } from "@v/dashboard/users/edit/schemas/user.schema"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"

const notify = useNotify()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

function defaultState(): UserData {
    return {
        name:       "",
        login:      "",
        password:   "",
        role:       Roles.USER,
        email:      "",
        partner_id: null,
        disabled:   true,
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)

const partners = ref<PartnerShortListItem[]>([])

const userId = computed(() => route.params.id as string)
const isNew = computed(() => userId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineField,
    meta,
    submitCount,
    setErrors
} = useForm<UserData>({
    validationSchema: userSchema(isNew.value),
    initialValues:    defaultState(),
})

const dynamicConfig = useConfigValidation(submitCount)

const [nameModel]      = defineField("name", dynamicConfig)
const [loginModel]     = defineField("login", dynamicConfig)
const [passwordModel]  = defineField("password", dynamicConfig)
const [roleModel]      = defineField("role", dynamicConfig)
const [emailModel]     = defineField("email", dynamicConfig)
const [partnerIdModel] = defineField("partner_id", dynamicConfig)
const [disabledModel]  = defineField("disabled", dynamicConfig)

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnersData,
        userData
    ] = await Promise.all([
        partnersAPI.shortList(),
        !isNew.value
            ? usersAPI.get(userId.value)
            : null
    ])

    if (
        partnersData instanceof HttpError ||
        userData instanceof HttpError
    ) {
        notify.error()
        return
    }

    partners.value = partnersData.list

    if (userData) {
        const user = userData.data
        resetForm({
            values: {
                name:       user.name,
                login:      user.login,
                role:       user.role,
                email:      user.email ?? "",
                partner_id: user.partner?.id || null,
                disabled:   user.disabled,
                password:   "",
            }
        })
    }

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!isNew.value && !meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardUsers })
        return
    }

    isLoading.value = true

    const [userResponse] = await Promise.all([
        isNew.value
            ? usersAPI.create(userId.value, formValues)
            : usersAPI.update(userId.value, formValues)
    ])

    isLoading.value = false

    if (userResponse instanceof HttpError) {
        if (userResponse?.errors) setErrors(userResponse.errors)
        notify.error()
        return
    }

    if (isNew.value) {
        notify.success(t("mc.dashboard.users.notify.created"))
    } else {
        notify.success(t("mc.notify.success"))
    }

    await router.push({
        name: DashboardRouteName.DashboardUsers
    })
})

function onCreatePassword() {
    passwordModel.value = generatePassword()
}

const rolesList = [
    {
        label: t("mc.roles.user"),
        value: Roles.USER,
    },
    {
        label: t("mc.roles.admin"),
        value: Roles.ADMIN,
    },
    {
        label: t("mc.roles.sysadmin"),
        value: Roles.SYSADMIN,
    }
]
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание пользователя'
            : 'Редактирование пользователя'"
        :pathBack="dashboardPaths.DashboardUsers"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="user-view"
        @save="onSave"
    >
        <b-form-card title="Учетные данные">
            <b-form-item
                label="Имя"
                required
            >
                <b-input-text
                    v-model="nameModel"
                    :disabled="isLoading"
                    :error="errors.name"
                />
            </b-form-item>

            <b-form-item
                label="Логин"
                required
            >
                <b-input-text
                    v-model="loginModel"
                    :disabled="isLoading"
                    :error="errors.login"
                    name="login"
                />
            </b-form-item>

            <b-form-item
                label="Пароль"
                :required="isNew"
            >
                <div class="password-wrapper">
                    <b-input-password
                        v-model="passwordModel"
                        :disabled="isLoading"
                        :error="errors.password"
                    />

                    <b-button-secondary
                        label="Создать новый"
                        variant="secondary"
                        @click="onCreatePassword"
                    />
                </div>
            </b-form-item>

            <b-form-item
                label="Права в системе"
                required
            >
                <b-select
                    v-model="roleModel"
                    :disabled="isLoading"
                    :options="rolesList"
                    :error="errors.role"
                />
            </b-form-item>

            <b-form-item label="Электронная почта">
                <b-input-text
                    v-model="emailModel"
                    :disabled="isLoading"
                    :error="errors.email"
                />
            </b-form-item>

            <b-form-item label="Филиал">
                <b-select
                    v-model="partnerIdModel"
                    :disabled="isLoading"
                    :options="partners"
                    :error="errors.partner_id"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                />
            </b-form-item>

            <b-form-item
                label="Заблокирован"
                class="label-align-center"
            >
                <b-toggle-switch
                    v-model="disabledModel"
                    :disabled="isLoading"
                    :error="errors.disabled"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style scoped lang="scss">
.user-view {
    .password-wrapper {
        display: flex;
        align-items: flex-start;
        gap: $indent-x1;
    }
}
</style>
