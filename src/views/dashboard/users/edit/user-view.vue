<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { dashboardPaths } from "@r/dashboard/path"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import BInputPassword from "@c/common/b-input/b-input-password.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BSelectButton from "@c/common/b-select-button/b-select-button.vue"
import BSwitch from "@c/common/b-switch/b-switch.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"
import type { UserData } from "@v/dashboard/users/edit/definitions/user"
import { UserSchema } from "@v/dashboard/users/edit/schemas/user.schema"
import { stateList } from "@v/dashboard/users/list/utils/users"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"
import { generatePassword } from "@/lib/utils"
import { Roles } from "@/shared/roles/roles"


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
        notes:      "",
        partner_id: null,
        disabled:   false,
        access:     {
            location_map: false,
        },
    }
}

const isFirstLoading = ref(true)
const isLoading = ref(false)

const partners = ref<PartnerOptionItem[]>([])

const userId = computed(() => route.params.id as string)
const isNew = computed(() => userId.value === "!new")

const {
    errors,
    resetForm,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
} = useVeeForm<UserData>({
    validationSchema: UserSchema(isNew.value),
    initialValues:    defaultState(),
})

const [nameModel] = defineLazyField("name")
const [loginModel] = defineLazyField("login")
const [passwordModel] = defineLazyField("password")
const [roleModel] = defineLazyField("role")
const [emailModel] = defineLazyField("email")
const [notesModel] = defineLazyField("notes")
const [partnerIdModel] = defineLazyField("partner_id")
const [disabledModel] = defineLazyField("disabled")
const [locationMapModel] = defineLazyField("access.location_map")

onMounted(async () => {
    isFirstLoading.value = true

    const [
        partnersData,
        userData,
    ] = await Promise.all([
        partnersAPI.options(),
        !isNew.value
            ? usersAPI.get(userId.value)
            : null,
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
                notes:      user.notes,
                password:   "",
                access:     {
                    location_map: user.access.location_map,
                },
            },
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
            : usersAPI.update(userId.value, formValues),
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
        name: DashboardRouteName.DashboardUsers,
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
    },
]
</script>

<template>
    <b-form
        :title="isNew
            ? 'Создание пользователя'
            : 'Редактирование пользователя'"
        :path-back="dashboardPaths.DashboardUsers"
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
                    :error="errors['name']"
                />
            </b-form-item>

            <b-form-item
                label="Логин"
                required
            >
                <b-input-text
                    v-model="loginModel"
                    :disabled="isLoading"
                    :error="errors['login']"
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
                        :error="errors['password']"
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
                    :error="errors['role']"
                />
            </b-form-item>

            <b-form-item label="Электронная почта">
                <b-input-text
                    v-model="emailModel"
                    :disabled="isLoading"
                    :error="errors['email']"
                />
            </b-form-item>

            <b-form-item label="Филиал">
                <b-select
                    v-model="partnerIdModel"
                    :disabled="isLoading"
                    :options="partners"
                    :error="errors['partner_id']"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                class="label-align-center"
            >
                <b-select-button
                    v-model="disabledModel"
                    :options="stateList"
                    :error="errors['disabled']"
                    option-label="name"
                    option-value="id"
                >
                    <template #option="{ option }">
                        <span :class="option.id ? 'is-disabled' : 'is-active'">
                            {{ option.name }}
                        </span>
                    </template>
                </b-select-button>
            </b-form-item>

            <b-form-item label="Примечания">
                <b-textarea
                    v-model="notesModel"
                    :error="errors['notes']"
                    :disabled="isLoading"
                    :maxlength="maxMessageLength"
                />
            </b-form-item>
        </b-form-card>

        <b-form-card title="Доступы">
            <b-form-item
                label="Карта для стройки"
                class="label-align-top"
            >
                <b-switch v-model="locationMapModel" />
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

    :deep(.b-select-button) {
        .p-togglebutton:has(.is-disabled).p-togglebutton-checked {
            .p-togglebutton-content {
                background-color: var(--p-red-400);
            }
        }
    }
}
</style>
