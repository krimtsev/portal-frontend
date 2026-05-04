<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import type { UserPartners } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import BButton from "@c/common/b-button/b-button.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { TicketFlagman } from "@v/profile/tickets/create/flagman/definitions/flagman"
import { FormSchema } from "@v/profile/tickets/create/flagman/schemas/flagman.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import {
    type TicketCategoriesItem,
    TicketCategorySlug,
} from "@v/profile/tickets/edit/definitions/ticket-category"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"


const { t } = useI18n()
const notify = useNotify()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
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
            returnRate:     "",
            auditScore:     "",
            mastersCount:   "",
            openingDate:    null,
            yandexMap:      "",
            twoGisMap:      "",
            cosmeticBrands: "",
            missedReports:  "",
        },
    }
}

const isDisabled = computed(() => isFirstLoading.value || isLoading.value)

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
    setFieldValue,
} = useVeeForm<TicketFlagman>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [returnRateModel] = defineLazyField("attributes.returnRate")
const [auditScoreModel] = defineLazyField("attributes.auditScore")
const [mastersCountModel] = defineLazyField("attributes.mastersCount")
const [openingDateModel] = defineLazyField("attributes.openingDate")
const [yandexMapModel] = defineLazyField("attributes.yandexMap")
const [twoGisMapModel] = defineLazyField("attributes.twoGisMap")
const [cosmeticBrandsModel] = defineLazyField("attributes.cosmeticBrands")
const [missedReportsModel] = defineLazyField("attributes.missedReports")

onMounted(async () => {
    isFirstLoading.value = true

    const [partners, category] = await Promise.all([
        partnerAPI.userPartners(),
        ticketAPI.category(TicketCategorySlug.FRANCHISE),
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

    setFieldValue("category_id", ticketCategory.value.id)
    setFieldValue("partner_id", userPartners.value.partner_id)

    isFirstLoading.value = false
})

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) return

    isLoading.value = true

    const ticketResponse = await ticketAPI.create(formValues)

    isLoading.value = false

    if (ticketResponse instanceof HttpError) {
        if (ticketResponse?.errors) setErrors(ticketResponse.errors)
        notify.error()
        return
    }

    notify.success(t("mc.ticket.notify.success"))
    await router.push({ name: ProfileRouteName.ProfileTickets })
})
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
                            v-model="partnerIdModel"
                            :options="userPartners.partners"
                            :is-loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            :error="errors['partner_id']"
                            option-label="name"
                            option-value="partner_id"
                            :placeholder="t('mc.common.partner')"
                            name="partner_id"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="returnRateModel"
                            :error="errors['attributes.returnRate']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.returnRate')"
                            name="returnRate"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="auditScoreModel"
                            :error="errors['attributes.auditScore']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.auditScore')"
                            name="auditScore"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="mastersCountModel"
                            :error="errors['attributes.mastersCount']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.mastersCount')"
                            name="mastersCount"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-date-picker
                            v-model="openingDateModel"
                            :error="errors['attributes.openingDate']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.openingDate')"
                            hour-format="24"
                            date-format="yy-mm-dd"
                            name="openingDate"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="cosmeticBrandsModel"
                            :error="errors['attributes.cosmeticBrands']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.cosmeticBrands')"
                            name="cosmeticBrands"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="missedReportsModel"
                            :error="errors['attributes.missedReports']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.missedReports')"
                            name="missedReports"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="yandexMapModel"
                            :error="errors['attributes.yandexMap']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.yandexMap')"
                            name="yandexMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="twoGisMapModel"
                            :error="errors['attributes.twoGisMap']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.flagman.placeholder.twoGisMap')"
                            name="twoGisMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.general.placeholder.message')"
                            :maxlength="maxMessageLength"
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
                            v-model="filesModel"
                            :error="errors['files']"
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
