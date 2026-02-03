<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BInputText from "@c/common/b-input-text/b-input-text.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PrimeSelect from "primevue/select"
import { useNotify } from "@/composables/notify/use-notify"
import { type UserPartners } from "@/api/modules/partner/partner"
import { cloneDeep, isEqual } from "lodash"
import {
    type FormSchemaType,
    FormSchema,
} from "@v/profile/tickets/create/administrator/_britva/schemas/administrator.schema"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import * as partnerAPI from "@/api/modules/partner/partner"
import { HttpError } from "@/api"
import { Qualification, type TicketAdministrator } from "@v/profile/tickets/create/administrator/_britva/definitions/administrator"
import BButtonGroups from "@c/common/b-button-groups/b-button-groups.vue"
import { qualificationName } from "@v/profile/tickets/create/administrator/_britva/utils/administrator"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"
import {
    type TicketCategoriesItem,
    TicketCategorySlug
} from "@v/profile/tickets/edit/definitions/ticket-category"
import BInputTelnum from "@c/common/b-input-telnum/b-input-telnum.vue"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
})

const ticketCategory = ref<TicketCategoriesItem>()

function defaultState(): TicketAdministrator {
    const queryQualification = route.query.qualification as string | undefined

    const qualification = queryQualification &&
        Object.values(Qualification).includes(queryQualification as Qualification)
            ? (queryQualification as Qualification)
            : Qualification.Senior

    return {
        title:       t("mc.ticket.administrator.title"),
        type:        TicketType.Administrator,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            qualification,
            name:          "",
            phone:         "",
            experience:    "",
        },
    }
}

const initialState = ref<TicketAdministrator>(defaultState())
const currentState = ref<TicketAdministrator>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

const qualificationItems = Object.values(Qualification).map(value => ({
    value,
    label: qualificationName(value)
}))

/** Валидация */
const { errors, submit, watchChanges, resetErrors } = useZodResolver<FormSchemaType>(FormSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const [partners, category] = await Promise.all([
        partnerAPI.userPartners(),
        ticketAPI.category(TicketCategorySlug.FRANCHISE)
    ])

    if (
        partners instanceof HttpError ||
        category instanceof HttpError
    ) {
        notify.error()
        return
    }

    userPartners.value = partners
    ticketCategory.value = category.data

    initialState.value.partner_id = userPartners.value.partner_id
    initialState.value.category_id = ticketCategory.value.id

    currentState.value = cloneDeep(initialState.value)
    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    const params = cloneDeep(currentState.value)
    params.title = t("mc.ticket.administrator.title")

    isLoading.value = true

    const resp = await ticketAPI.create(params)

    isLoading.value = false

    if (resp instanceof HttpError) {
        notify.error()
        return
    }

    currentState.value = cloneDeep(initialState.value)
    notify.success(t("mc.ticket.notify.success"))
    resetErrors()

    await router.push({ name: ProfileRouteName.ProfileTickets })
}
</script>

<template>
    <portal-page
        :title="t('mc.ticket.administrator.title')"
        right-image="template/ticket-administrator.png"
        class="administrator-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">
                        <prime-select
                            v-model="currentState.partner_id"
                            :options="userPartners.partners"
                            :loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            :error="errors.partner_id"
                            optionLabel="name"
                            optionValue="partner_id"
                            :placeholder="t('mc.common.partner')"
                            name="partner_id"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-12 py-x2">
                        <b-button-groups
                            v-model="currentState.attributes.qualification"
                            :items="qualificationItems"
                            :disabled="isFirstLoading"
                            name="qualification"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.name"
                            :error="errors.attributes?.name"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.administrator.placeholder.name')"
                            name="name"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="currentState.attributes.phone"
                            :error="errors.attributes?.phone"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.administrator.placeholder.phone')"
                            name="phone"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.experience"
                            :error="errors.attributes?.experience"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.administrator.placeholder.experience')"
                            name="experience"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.administrator.placeholder.message')"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <div class="content">
                            <p class="mb-x0"> Прикрепите: </p>
                            <ul>
                                <li>Скриншоты сертификатов о прохождении портала обучения</li>
                                <li>Скриншот учетной записи из YCLIENTS</li>
                            </ul>
                          </div>

                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.administrator.placeholder.files')"
                        />
                    </div>

                    <div class="col-12">
                        <b-button
                            :label="t('mc.common.send')"
                            width-full
                            :disabled="isDisabled"
                            :loading="isLoading"
                            @click="onSave"
                        />
                    </div>
                </div>
            </div>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.administrator-create-view {
    margin-bottom: $indent-x4;

    .content {
        @include text-content;
    }
}
</style>
