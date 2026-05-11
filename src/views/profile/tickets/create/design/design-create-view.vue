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
import BInputTelnum from "@c/common/b-input/b-input-telnum.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { TicketDesign } from "@v/profile/tickets/create/design/definitions/design"
import { FormSchema } from "@v/profile/tickets/create/design/schemas/design.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { maxMessageLength, maxMessageLengthShort } from "@v/profile/tickets/list/definitions/tickets-list"
import { DepartmentType } from "@/shared/department/department"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

function defaultState(): TicketDesign {
    return {
        title:      t("mc.ticket.design.title"),
        type:       TicketType.Design,
        partner_id: null,
        department: DepartmentType.OFFICE_MANAGER,
        message:    "",
        files:      [],
        attributes: {
            name:         "",
            phone:        "",
            website:      "",
            registration: "",
            yandexMap:    "",
            twoGisMap:    "",
            instagram:    "",
            telegram:     "",
            format:       "",
            promotion:    "",
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
} = useVeeForm<TicketDesign>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [nameModel] = defineLazyField("attributes.name")
const [phoneModel] = defineLazyField("attributes.phone")
const [websiteModel] = defineLazyField("attributes.website")
const [registrationModel] = defineLazyField("attributes.registration")
const [yandexMapModel] = defineLazyField("attributes.yandexMap")
const [twoGisMapModel] = defineLazyField("attributes.twoGisMap")
const [instagramModel] = defineLazyField("attributes.instagram")
const [telegramModel] = defineLazyField("attributes.telegram")
const [formatModel] = defineLazyField("attributes.format")
const [promotionModel] = defineLazyField("attributes.promotion")

onMounted(async () => {
    isFirstLoading.value = true

    const [partners] = await Promise.all([
        partnerAPI.userPartners(),
    ])

    if (partners instanceof HttpError) {
        notify.error()
        return
    }

    userPartners.value = partners

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
        :title="t('mc.ticket.design.title')"
        right-image="template/ticket-design.png"
        class="design-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <b-title
                    title="Контактное лицо"
                    variant="sm"
                    class="mb-x2"
                />

                <div class="grid grid-reset-rows ">
                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.name')"
                            name="name"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="phoneModel"
                            :error="errors['attributes.phone']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.phone')"
                            name="phone"
                            class="full-width"
                        />
                    </div>
                </div>

                <b-title
                    title="Данные филиала"
                    variant="sm"
                    class="my-x2"
                />

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
                            v-model="websiteModel"
                            :error="errors['attributes.website']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.website')"
                            name="website"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="registrationModel"
                            :error="errors['attributes.registration']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.registration')"
                            name="registration"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="yandexMapModel"
                            :error="errors['attributes.yandexMap']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.yandexMap')"
                            name="yandexMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="twoGisMapModel"
                            :error="errors['attributes.twoGisMap']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.twoGisMap')"
                            name="twoGisMap"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="instagramModel"
                            :error="errors['attributes.instagram']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.instagram')"
                            name="instagram"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="telegramModel"
                            :error="errors['attributes.telegram']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.telegram')"
                            name="telegram"
                            class="full-width"
                        />
                    </div>
                </div>

                <b-title
                    title="Требования к макету"
                    variant="sm"
                    class="my-x2"
                />

                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="formatModel"
                            :error="errors['attributes.format']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.format')"
                            :maxlength="maxMessageLengthShort"
                            label="Какой формат, для чего будет использоваться, размер, цвета? Если вам необходим стартовый набор, напишите в поле “Стартовый набор”."
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="promotionModel"
                            :error="errors['attributes.promotion']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.promotion')"
                            :maxlength="maxMessageLengthShort"
                            label="Промокод, срок действия, размер скидки. Если вам необходим стартовый набор, напишите в поле “Стартовый набор”."
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.message')"
                            :maxlength="maxMessageLength"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="filesModel"
                            :error="errors['files']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.files')"
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
.design-create-view {
    margin-bottom: $indent-x4;
}
</style>
