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
import type { TicketCategoriesItem } from "@v/profile/tickets/list/definitions/tickets-list"
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
import { TRANSLATIONS } from "@v/profile/tickets/create/general/utils/general"

const notify = useNotify()

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

    isLoading.value = true

    // const resp = await userPartnerAPI.change(values)

    isLoading.value = false

    // if (resp instanceof HttpError) {
    //     notify.error()
    //     return
    // }
}
</script>

<template>
    <portal-page
        title="Общая заявка"
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
                            placeholder="Филиал"
                            name="partner_id"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.title"
                            :error="errors.title"
                            :disabled="isFirstLoading"
                            :placeholder="TRANSLATIONS.title"
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
                            placeholder="Отдел"
                            name="category_id"
                        />
                    </div>


                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="TRANSLATIONS.message"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="TRANSLATIONS.files"
                            name="files"
                        />
                    </div>

                    <div class="col-12">
                        <b-button
                            label="Отправить"
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
