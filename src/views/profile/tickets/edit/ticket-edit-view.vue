<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { useNotify } from "@/composables/notify/use-notify"
import type {Ticket, TicketItem} from "@v/profile/tickets/edit/definitions/ticket"
import { cloneDeep, isEqual } from "lodash"
import * as z from "zod"
import { messageSchema } from "@v/profile/tickets/schemas/ticket-schemas"
import { filesSchema } from "@/schemas/zod"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import { HttpError } from "@/api"
import BButton from "@c/common/b-button/b-button.vue"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { useRoute } from "vue-router"

const route = useRoute()
const notify = useNotify()

const isFirstLoading = ref(true)
const isLoading = ref(false)

function defaultState(): TicketItem {
    return {
        title:       "",
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {},
    }
}

const initialState = ref<TicketItem>(defaultState())
const currentState = ref<TicketItem>(defaultState())

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

const formSchema = z.object({
    message: messageSchema,
    files:   filesSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
const { errors, submit, watchChanges } = useZodResolver<FormSchemaType>(formSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const id = route.params.id as string

    const [ticketData] = await Promise.all([
        ticketAPI.get(id),
    ])

    if (ticketData instanceof HttpError) {
        notify.error()
        return
    }

    initialState.value = {
        ...initialState.value,

    }

    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    isLoading.value = true

    isLoading.value = false
}
</script>

<template>
    <portal-page
        title="Заявка на специалиста"
        right-image="template/ticket-specialist.png"
        class="ticket-edit-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">

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

<style scoped lang="scss">
.ticket-edit-view {

}
</style>
