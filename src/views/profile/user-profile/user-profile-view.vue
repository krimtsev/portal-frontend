<script setup lang="ts">
import { ref, onMounted } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalFormItem from "@c/portal/portal-form-item/portal-form-item.vue"
import * as userProfileAPI from "@/api/modules/profile/user-profile/user-profile"
import type { PartnerData, UserData } from "@/api/modules/profile/user-profile/definitions/user-profile"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { getRoleName } from "@/lib/localize-helper"
import BText from "@c/common/b-text/b-text.vue"
import { Roles } from "@/shared/roles/roles"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"

const notify = useNotify()

const user = ref<UserData>({
    login:  "",
    name:   "",
    role:   Roles.USER,
    email:  null,
    avatar: null,
})
const partner = ref<PartnerData>()
const isLoading = ref<boolean>(true)

onMounted(async () => {
    const data = await userProfileAPI.getUserProfile()

    if (data instanceof HttpError) {
        notify.error()
        return false
    }

    user.value = data.user
    partner.value = data.partner

    isLoading.value = false
})

</script>

<template>
    <portal-page
        title="Информация о пользователе"
        class="user-profile-view"
    >
        <portal-card
            title="Профиль"
            mobile-wrap-form
        >
            <portal-form-item
                label="Логин"
                class="label-align-top"
            >
                <b-skeleton
                    :is-loading="isLoading"
                    width="200px"
                >
                    <b-text :value="user.login" />
                </b-skeleton>
            </portal-form-item>

            <portal-form-item
                label="Имя"
                class="label-align-top"
            >
                <b-skeleton
                    :is-loading="isLoading"
                    width="200px"
                >
                    <b-text :value="user.name" />
                </b-skeleton>
            </portal-form-item>

            <portal-form-item
                label="Роль"
                class="label-align-top"
            >
                <b-skeleton
                    :is-loading="isLoading"
                    width="200px"
                >
                    <b-text :value="getRoleName(user.role)" />
                </b-skeleton>
            </portal-form-item>
        </portal-card>

        <portal-card
            v-if="partner"
            title="Партнер"
            mobile-wrap-form
        >
            <portal-form-item
                label="Название филиала"
                class="label-align-top"
            >
                <b-text :value="partner.name" />
            </portal-form-item>

            <portal-form-item
                label="Имя партнера"
                class="label-align-top"
            >
                <b-text :value="partner.organization" />
            </portal-form-item>

            <portal-form-item
                label="ИНН"
                class="label-align-top"
            >
                <b-text :value="partner.inn" />
            </portal-form-item>

            <portal-form-item
                label="Email"
                class="label-align-top"
            >
                <b-text :value="partner.email" />
            </portal-form-item>

            <portal-form-item
                label="Yclients ID"
                class="label-align-top"
            >
                <b-text :value="partner.yclients_id" />
            </portal-form-item>

            <portal-form-item
                label="Номер телефона"
                class="label-align-top"
            >
                <b-text :value="partner.mango_telnum" />
            </portal-form-item>
        </portal-card>
    </portal-page>
</template>

<style scoped lang="scss">
.user-profile-view {
    :deep(.portal-card) {
        flex-grow: unset;
    }

    .content {
        @include text-content;
    }
}
</style>
