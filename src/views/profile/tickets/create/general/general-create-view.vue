<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { cloneDeep, isEqual } from "lodash"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PrimeSelect from "primevue/select"
import BInputText from "@c/common/b-input-text/b-input-text.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import type { UserPartners } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketsAPI from "@/api/modules/profile/tickets/tickets"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import type { TicketCategoriesItem } from "@v/profile/tickets/edit/definitions/ticket-category"
import * as z from "zod"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import { filesSchema } from "@/schemas/zod"
import {
    categoryIdSchema,
    messageSchema,
    partnerIdSchema,
    titleSchema
} from "@v/profile/tickets/schemas/ticket-schemas"
import type { TicketGeneral } from "@v/profile/tickets/create/general/definitions/general"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"

const notify = useNotify()
const { t } = useI18n()

/** Начальное состояние */
const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
})

const ticketCategories = ref<TicketCategoriesItem[]>([])

function defaultState(): TicketGeneral {
    return {
        title:       "",
        type:        TicketType.General,
        message:     "",
        partner_id:  null,
        category_id: null,
        files:       []
    }
}

const initialState = ref<TicketGeneral>(defaultState())
const currentState = ref<TicketGeneral>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

/** Валидация */
const formSchema = z.object({
    title:       titleSchema,
    message:     messageSchema,
    partner_id:  partnerIdSchema,
    category_id: categoryIdSchema,
    files:       filesSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
const { errors, submit, watchChanges } = useZodResolver<FormSchemaType>(formSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const [partners, categories] = await Promise.all([
        partnerAPI.userPartners(),
        ticketsAPI.categories(),
    ])

    if (
        partners instanceof HttpError ||
        categories instanceof HttpError
    ) {
        notify.error()
        return
    }

    userPartners.value = partners
    ticketCategories.value = categories.list

    initialState.value.partner_id = userPartners.value.partner_id
    initialState.value.category_id = ticketCategories.value[0].id

    currentState.value = cloneDeep(initialState.value)

    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    const params = cloneDeep(currentState.value)

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
        :title="t('mc.ticket.general.title')"
        right-image="template/ticket-general.png"
        class="general-create-view"
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

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.title"
                            :error="errors.title"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.general.placeholder.title')"
                            name="title"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <prime-select
                            v-model="currentState.category_id"
                            :error="errors.category_id"
                            :options="ticketCategories"
                            :loading="isFirstLoading"
                            :disabled="isFirstLoading"
                            optionLabel="title"
                            optionValue="id"
                            :placeholder="t('mc.ticket.category')"
                            name="category_id"
                        />
                    </div>


                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.general.placeholder.message')"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
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
                            :loading="isLoading"
                            width-full
                            @click="onSave"
                        />
                    </div>
                </div>
            </div>
        </div>
    </portal-page>
</template>
