<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import { useI18n } from "vue-i18n"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouter } from "vue-router"
import type { UserPartners } from "@/api/modules/partner/partner"
import {
    type TicketCategoriesItem,
    TicketCategorySlug
} from "@v/profile/tickets/edit/definitions/ticket-category"
import type { TicketFlagman } from "@v/profile/tickets/create/flagman/definitions/flagman"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { cloneDeep, isEqual } from "lodash"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import {
    type FormSchemaType,
    FormSchema,
} from "@v/profile/tickets/create/flagman/schemas/flagman.schema"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { HttpError } from "@/api"
import { ProfileRouteName } from "@r/profile/route-names"
import BSelect from "@c/common/b-select/b-select.vue"


const { t } = useI18n()
const notify = useNotify()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
})

const ticketCategory = ref<TicketCategoriesItem>()

function defaultState(): TicketFlagman {
    return {
        title:       t("mc.ticket.flagman.title"),
        type:        TicketType.Flagman,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            returnRate:          "",
            auditScore:          "",
            mastersCount:        "",
            openingDate:         null,
            yandexMap:           "",
            twoGisMap:           "",
            cosmeticBrands:      "",
            missedReports:       "",
        },
    }
}

const initialState = ref<TicketFlagman>(defaultState())
const currentState = ref<TicketFlagman>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

/** Валидация */
const {
    errors,
    submit,
    watchChanges,
    resetErrors
} = useZodResolver<FormSchemaType>(FormSchema)

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
    params.title = t("mc.ticket.flagman.title")

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
        :title="t('mc.ticket.flagman.title')"
        class="flagman-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">
                        <b-select
                            v-model="currentState.partner_id"
                            :options="userPartners.partners"
                            :is-loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            :error="errors.partner_id"
                            optionLabel="name"
                            optionValue="partner_id"
                            :placeholder="t('mc.common.partner')"
                            name="partner_id"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.returnRate"
                            :error="errors.attributes?.returnRate"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.returnRate')"
                            name="returnRate"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.auditScore"
                            :error="errors.attributes?.auditScore"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.auditScore')"
                            name="auditScore"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.mastersCount"
                            :error="errors.attributes?.mastersCount"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.mastersCount')"
                            name="mastersCount"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-date-picker
                            v-model="currentState.attributes.openingDate"
                            :error="errors.attributes?.openingDate"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.openingDate')"
                            hour-format="24"
                            full-width
                            dateFormat="dd-mm-yy"
                            name="openingDate"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.cosmeticBrands"
                            :error="errors.attributes?.cosmeticBrands"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.cosmeticBrands')"
                            name="cosmeticBrands"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.missedReports"
                            :error="errors.attributes?.missedReports"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.missedReports')"
                            name="missedReports"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.yandexMap"
                            :error="errors.attributes?.yandexMap"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.yandexMap')"
                            name="yandexMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.twoGisMap"
                            :error="errors.attributes?.twoGisMap"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.twoGisMap')"
                            name="twoGisMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.general.placeholder.message')"
                            name="message"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <div class="content">
                            <p class="mb-x0"> Прикрепите: </p>
                            <ul>
                                <li>Пройденные аттестации мастеров и админов</li>
                            </ul>
                        </div>

                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.general.placeholder.files')"
                            name="files"
                        />
                    </div>

                    <div class="col-12">
                        <b-button
                            :label="t('mc.common.send')"
                            :disabled="isDisabled"
                            :is-loading="isLoading"
                            class="full-width"
                            @click="onSave"
                        />
                    </div>
                </div>
            </div>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.flagman-create-view {
    margin-bottom: $indent-x4;

    .content {
        @include text-content;
    }
}
</style>
