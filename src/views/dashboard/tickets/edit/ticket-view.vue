<script setup lang="ts">
import {type ComponentPublicInstance, computed, nextTick, onMounted, ref} from "vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import PrimeSelect from "primevue/select"
import PrimeInputText from "primevue/inputtext"
import PrimeTextarea from "primevue/textarea"
import { dashboardPaths } from "@r/dashboard/path"
import { stateList } from "@v/profile/tickets/list/utils/ticket"
import type { TicketCategoriesItem } from "@v/profile/tickets/edit/definitions/ticket-category"
import type { PartnerShortListItem } from "@v/dashboard/partners/definitions/partners"
import * as ticketsAPI from "@/api/modules/dashboard/tickets/tickets"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { useRoute } from "vue-router"
import {
    type TicketDetails,
    type TicketMessage,
    type TicketEvent,
    TicketMessageType,
    TicketState,
    TicketType,
} from "@v/profile/tickets/edit/definitions/ticket"
import { cloneDeep } from "lodash"
import type { TicketStateData } from "@v/dashboard/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"
import { DateTime } from "luxon"
import {type ChatMessageFile, ChatMessageType} from "@c/chat/definitions/chat-message"
import { formatChanges } from "@v/profile/tickets/edit/utils/ticket"
import ChatMessage from "@c/chat/chat-message.vue"
import ChatContainer from "@c/chat/chat-container.vue"
import ChatFiles from "@c/chat/chat-files.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import * as ticketAPI from "@/api/modules/dashboard/tickets/tickets"
import { downloadExternalFile } from "@/lib/files"

const notify = useNotify()
const route = useRoute()
const { t } = useI18n()

function defaultState(): TicketStateData {
    return {
        title:       "",
        type:        TicketType.General,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        state:       TicketState.New
    }
}

const isLoading = ref(true)
const isFirstLoading = ref(true)
const isLoadingFile = ref(false)

const ticketStateList = stateList()
const ticketCategoriesList = ref<TicketCategoriesItem[]>([])
const partnersList = ref<PartnerShortListItem[]>([])

const initialState = ref<TicketStateData>(defaultState())
const currentState = ref<TicketStateData>(defaultState())

const ticketDetails = ref<TicketDetails>({
    id:         0,
    title:      "",
    type:       TicketType.General,
    category:   null,
    partner:    null,
    user:       null,
    state:      TicketState.New,
    attributes: {},
    timeline:   [],
})

const chatRef = ref<ComponentPublicInstance<{ scrollToBottom: () => void }> | null>(null)

onMounted(async () => {
    isLoading.value = true
    isFirstLoading.value = true

    const id = route.params.id as string

    const [
        ticketData,
        categoriesData,
        partnersData
    ] = await Promise.all([
        ticketsAPI.get(id),
        ticketsAPI.categories(),
        partnersAPI.shortList()
    ])

    if (
        ticketData instanceof HttpError ||
        categoriesData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    ticketCategoriesList.value = categoriesData.list
    partnersList.value = partnersData.list

    ticketDetails.value = ticketData.data

    initialState.value = {
        ...initialState.value,
        title:       ticketDetails.value.title,
        partner_id:  ticketDetails.value.partner?.id || null,
        category_id: ticketDetails.value.category?.id || null,
        type:        ticketDetails.value.type || null,
    }
    currentState.value = cloneDeep(initialState.value)

    isLoading.value = false
    isFirstLoading.value = false
})

const attributes = computed(() => {
    return Object.entries(ticketDetails.value?.attributes || {})
        .map(([label, value]) => {
            if (
                ticketDetails.value.type === TicketType.Certificate &&
                label === "paymentDate"
            ) {
                value = DateTime.fromISO(value, { zone: "utc" })
                    .toFormat("dd.MM.yyyy H:mm:ss")
            }

            return {
                label: attributeLabel(label),
                value
            }
        })
})

const attributeLabel = (key?: string): string => {
    if (!ticketDetails.value) return ""

    const type = ticketDetails.value.type
    if (!type || !key) return ""

    return t(`mc.ticket.${type}.placeholder.${key}`)
}

function getChatMessageType(item: TicketMessage) {
    return ticketDetails.value.user?.login === item.user.login
        ? ChatMessageType.Sent
        : ChatMessageType.Received
}

async function download(item: ChatMessageFile) {
    if (isLoadingFile.value) return

    isLoadingFile.value = true

    const data = await ticketAPI.download(ticketDetails.value.id, item.name)

    if (data instanceof HttpError) {
        notify.error()
        isLoadingFile.value = false
        return false
    }

    const { title, ext } = item
    downloadExternalFile(data, `${title}.${ext}`)
    isLoadingFile.value = false
}

async function onSave() {
    isLoading.value = true

    const ticketData = await ticketAPI.update(
        ticketDetails.value.id,
        currentState.value
    )

    if (ticketData instanceof HttpError) {
        notify.error()
        isLoading.value = false
        return
    }

    ticketDetails.value = ticketData.data
    currentState.value.message = ""

    await nextTick(() => chatRef.value?.scrollToBottom())

    isLoading.value = false
}
</script>

<template>
    <b-form
        title="Редактирование заявки"
        :pathBack="dashboardPaths.DashboardTickets"
        :is-loading="isLoading"
        :is-first-loading="isFirstLoading"
        class="ticket-view"
        @save="onSave"
    >
        <b-form-card title="Данные филиала">
            <b-form-item
                label="Тема запроса"
                required
            >
                <prime-input-text
                    v-model="currentState.title"
                    :disabled="isLoading"
                    class="title"
                />
            </b-form-item>

            <b-form-item
                label="Филиал"
                required
            >
                <prime-select
                    v-model="currentState.partner_id"
                    :options="partnersList"
                    :disabled="isLoading"
                    filter
                    option-label="name"
                    option-value="id"
                    placeholder="Выберите филиал"
                    class="partner"
                />
            </b-form-item>

            <b-form-item
                label="Отдел"
                required
            >
                <prime-select
                    v-model="currentState.category_id"
                    :options="ticketCategoriesList"
                    :disabled="isLoading"
                    filter
                    option-label="title"
                    option-value="id"
                    placeholder="Выберите отдел"
                    class="categories"
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                required
            >
                <prime-select
                    v-model="currentState.state"
                    :options="ticketStateList"
                    :disabled="isLoading"
                    filter
                    option-label="label"
                    option-value="value"
                    placeholder="Выберите статус"
                    class="state"
                />
            </b-form-item>
        </b-form-card>

        <b-form-card
            v-if="ticketDetails?.attributes"
            title="Дополнительная информация"
        >
            <b-form-item
                v-for="({label, value}) in attributes"
                :key="label"
                :label="label"
                class="label-align-center"
            >
                <span> {{ value }} </span>
            </b-form-item>
        </b-form-card>

        <b-form-card>
            <b-form-item label="Чат">
                <chat-container
                    v-if="ticketDetails.timeline.length"
                    ref="chatRef"
                    class="chat"
                >
                    <div
                        v-for="(item, idx) in ticketDetails.timeline"
                        :key="idx"
                    >
                        <template v-if="item.type === TicketMessageType.Message">
                            <chat-message
                                :type="getChatMessageType(item)"
                                :name="item.user.name"
                                :login="item.user.login"
                                :text="item.text"
                                :stamp="item.created_at"
                            >
                                <template
                                    v-if="item.files.length"
                                    #files
                                >
                                    <chat-files
                                        :items="item.files"
                                        @click="download"
                                    />
                                </template>
                            </chat-message>
                        </template>

                        <template v-else>
                            <chat-message
                                avatar="avatars/barber_system.png"
                                :type="ChatMessageType.System"
                                :name="t('mc.partner.assistant')"
                                :text="formatChanges(item)"
                            />
                        </template>
                    </div>
                </chat-container>
            </b-form-item>

            <b-form-item label="Сообщение">
                <prime-textarea
                    v-model="currentState.message"
                    rows="5"
                    class="message"
                    placeholder="Введите сообщение"
                    style="resize: none"
                />
            </b-form-item>

            <b-form-item label="Загрузить файл">
                <b-file-upload
                    v-model="currentState.files"
                    :placeholder="t('mc.ticket.general.placeholder.files')"
                    name="files"
                    class="files"
                />
            </b-form-item>
        </b-form-card>
    </b-form>
</template>

<style scoped lang="scss">
.ticket-view {
    .partner,
    .categories,
    .state,
    .title {
        @include input-width();
    }

    .chat,
    .message,
    .files {
        width: 100%;
    }
}
</style>
