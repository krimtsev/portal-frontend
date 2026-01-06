<script setup lang="ts">
import { onMounted, computed, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PrimeSelect from "primevue/select"
import BButton from "@c/common/b-button/b-button.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BInputText from "@c/common/b-input-text/b-input-text.vue"
import { useNotify } from "@/composables/notify/use-notify"
import type { UserPartners } from "@/api/modules/partner/partner"
import { isEqual, cloneDeep } from "lodash"
import * as z from "zod"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import { filesSchema } from "@/schemas/zod"
import * as partnerAPI from "@/api/modules/partner/partner"
import { HttpError } from "@/api"
import type { TicketDesign } from "@v/profile/tickets/create/design/definitions/design"
import {
    messageSchema,
    nameSchema,
    partnerIdSchema,
    phoneSchema,
    urlSchema
} from "@v/profile/tickets/schemas/ticket-schemas"
import BTitle from "@c/common/b-title/b-title.vue"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"


const notify = useNotify()
const { t } = useI18n()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
})

function defaultState(): TicketDesign {
    return {
        title:       t("mc.ticket.design.title"),
        type:        TicketType.Design,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            name:         "",
            phone:        "",
            website:      "",
            registration: "",
            yandexMap:    "",
            twoGisMap:    "",
            instagram:    "",
            format:       "",
            promotion:    "",
        },
    }
}

const initialState = ref<TicketDesign>(defaultState())
const currentState = ref<TicketDesign>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

/** Валидация */
const attributesSchema = z.object({
    name:         nameSchema,
    phone:        phoneSchema,
    website:      urlSchema,
    registration: urlSchema,
    yandexMap:    urlSchema,
    twoGisMap:    urlSchema,
    instagram:    urlSchema,
    format:       z.string().optional(),
    promotion:    z.string().optional(),
})

const formSchema = z.object({
    attributes:  attributesSchema,
    message:     messageSchema,
    partner_id:  partnerIdSchema,
    files:       filesSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
const { errors, submit, watchChanges } = useZodResolver<FormSchemaType>(formSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const partners = await partnerAPI.userPartners()

    if (partners instanceof HttpError) {
        notify.error()
        return
    }

    userPartners.value = partners

    initialState.value.partner_id = userPartners.value.partner_id
    currentState.value = cloneDeep(initialState.value)

    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    const params = cloneDeep(currentState.value)
    params.title = t("mc.ticket.design.title")

    const resp = await ticketAPI.create(params)

    isLoading.value = false

    if (resp instanceof HttpError) {
        notify.error()
        return
    }

    currentState.value = cloneDeep(initialState.value)
    notify.success(t("mc.ticket.notify.success"))
}
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
                            v-model="currentState.attributes.name"
                            :error="errors.attributes?.name"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.name')"
                            name="name"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.phone"
                            :error="errors.attributes?.phone"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.phone')"
                            name="phone"
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

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.website"
                            :error="errors.attributes?.website"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.website')"
                            name="website"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.registration"
                            :error="errors.attributes?.registration"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.registration')"
                            name="registration"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.yandexMap"
                            :error="errors.attributes?.yandexMap"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.yandexMap')"
                            name="yandexMap"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.twoGisMap"
                            :error="errors.attributes?.twoGisMap"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.twoGisMap')"
                            name="twoGisMap"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.instagram"
                            :error="errors.attributes?.instagram"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.instagram')"
                            name="instagram"
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
                            v-model="currentState.attributes.format"
                            :error="errors.attributes?.format"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.format')"
                            hint="Какой формат, для чего будет использоваться, размер, цвета? Если вам необходим стартовый набор, напишите в поле “Стартовый набор”."
                            full-width
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.attributes.promotion"
                            :error="errors.attributes?.promotion"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.promotion')"
                            hint="Промокод, срок действия, размер скидки. Если вам необходим стартовый набор, напишите в поле “Стартовый набор”."
                            full-width
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.message')"
                            full-width
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.design.placeholder.files')"
                            name="files"
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
.design-create-view {
    margin-bottom: $indent-x4;
}
</style>
