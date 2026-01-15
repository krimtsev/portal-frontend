<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from "vue"
import type { ComponentPublicInstance } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { useNotify } from "@/composables/notify/use-notify"
import {
    type Ticket,
    type TicketDetails,
    type TicketMessage,
    TicketMessageType,
    TicketState,
    TicketType
} from "@v/profile/tickets/edit/definitions/ticket"
import { cloneDeep, isEqual } from "lodash"
import * as z from "zod"
import { requiredMessageSchema } from "@v/profile/tickets/schemas/ticket-schemas"
import { filesSchema } from "@/schemas/zod"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import { HttpError } from "@/api"
import BButton from "@c/common/b-button/b-button.vue"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { useRoute } from "vue-router"
import BText from "@c/common/b-text/b-text.vue"
import PortalFormItem from "@c/portal/portal-form-item/portal-form-item.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import { stateName } from "@v/profile/tickets/list/utils/ticket"
import { useI18n } from "vue-i18n"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import ChatContainer from "@c/chat/chat-container.vue"
import ChatMessage from "@c/chat/chat-message.vue"
import {
    formatChanges,
    hasTimelineMessage,
    normalizeAttributes
} from "@v/profile/tickets/edit/utils/ticket"
import {
    type ChatMessageFile,
    ChatMessageType
} from "@c/chat/definitions/chat-message"
import { downloadExternalFile } from "@/lib/files"
import ChatFiles from "@c/chat/chat-files.vue"
import { ProfileRouteName } from "@r/profile/route-names"
import { useRouter } from "vue-router"

const router = useRouter()

enum LoadingState {
    Save = "save",
    Remove = "remove"
}

const route = useRoute()
const notify = useNotify()
const { t } = useI18n()

const isFirstLoading = ref(true)
const isLoadingFile = ref(false)
const loadingState = ref<LoadingState | null>(null)

const chatRef = ref<ComponentPublicInstance<{ scrollToBottom: () => void }> | null>(null)

function defaultState(): Ticket {
    return {
        title:       "",
        type:        TicketType.General,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
    }
}

const initialState = ref<Ticket>(defaultState())
const currentState = ref<Ticket>(defaultState())

const ticketDetails = ref<TicketDetails>({
    id:       0,
    title:    "",
    type:     TicketType.General,
    category: null,
    partner:  null,
    user:     null,
    state:    TicketState.New,
    attributes: {},
    timeline:   [],
})

const isChanged = computed(() => {
    return !isEqual(initialState.value, currentState.value)
})

const isDisabled = computed((): boolean => {
    return isFirstLoading.value || !!loadingState.value
})

const attributes = computed(() => normalizeAttributes(ticketDetails.value))

function getChatMessageType(item: TicketMessage) {
    return ticketDetails.value.user?.login === item.user.login
        ? ChatMessageType.Sent
        : ChatMessageType.Received
}

const hasMessages = computed(() => {
    return hasTimelineMessage(ticketDetails.value.timeline)
})

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

const isEditable = computed(() => {
    return [
        TicketState.New,
        TicketState.Waiting,
        TicketState.InProgress
    ].includes(ticketDetails.value.state)
})

const formSchema = z.object({
    message: requiredMessageSchema,
    files:   filesSchema,
})

type FormSchemaType = z.infer<typeof formSchema>
const { errors, submit, watchChanges, resetErrors } = useZodResolver<FormSchemaType>(formSchema)

watchChanges(currentState)

onMounted(async () => {
    isFirstLoading.value = true

    const id = route.params.id as string

    const [ticketData] = await Promise.all([
        ticketAPI.get(id),
    ])

    if (ticketData instanceof HttpError) {
        notify.error()
        await router.push({ name: ProfileRouteName.ProfileTickets })
        return
    }

    ticketDetails.value = ticketData.data

    initialState.value = {
        ...initialState.value,
        title:       ticketDetails.value.title,
        partner_id:  ticketDetails.value.partner?.id || null,
        category_id: ticketDetails.value.category?.id || null,
        type:        ticketDetails.value.type || null,
    }
    currentState.value = cloneDeep(initialState.value)

    isFirstLoading.value = false
})

async function onSave() {
    const isValid = submit(currentState.value)
    if (!isValid) return
    if (!isChanged.value) return

    loadingState.value = LoadingState.Save

    const ticketData = await ticketAPI.updateMessage(
        ticketDetails.value.id,
        currentState.value
    )

    if (ticketData instanceof HttpError) {
        notify.error()
        loadingState.value = null
        return
    }

    ticketDetails.value = ticketData.data
    currentState.value.message = ""
    resetErrors()

    loadingState.value = null
    await nextTick(() => chatRef.value?.scrollToBottom())
}

async function onRemove() {
    if (loadingState.value) return

    loadingState.value = LoadingState.Remove

    const data = await ticketAPI.remove(ticketDetails.value.id)

    if (data instanceof HttpError) {
        notify.error()
        loadingState.value = null
        return
    }

    loadingState.value = null
    ticketDetails.value.state = TicketState.Closed

    notify.success("Заявка успешно закрыта")

    await router.push({ name: ProfileRouteName.ProfileTickets })
}
</script>

<template>
    <portal-page
        :title="currentState.title"
        class="ticket-edit-view"
        :is-loading-title="isFirstLoading"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <portal-card
                    title="Данные филиала"
                    mobile-wrap-form
                    class="mb-x2"
                >
                    <portal-form-item
                        label="Филиал"
                        class="label-align-top"
                    >
                        <b-text
                            :is-loading="isFirstLoading"
                            :value="ticketDetails.partner?.name"
                        />
                    </portal-form-item>

                    <portal-form-item
                        label="Отдел"
                        class="label-align-top"
                    >
                        <b-text
                            :is-loading="isFirstLoading"
                            :value="ticketDetails.category?.title"
                        />
                    </portal-form-item>

                    <portal-form-item
                        label="Статус"
                        class="label-align-top"
                    >
                        <b-text
                            :is-loading="isFirstLoading"
                            :value="stateName(ticketDetails.state)"
                        />
                    </portal-form-item>
                </portal-card>

                <portal-card
                    v-if="attributes.length"
                    title="Дополнительная информация"
                    mobile-wrap-form
                    class="mb-x2"
                >
                    <portal-form-item
                        v-for="{ label, value } in attributes"
                        :key="label"
                        :label="label"
                        class="label-align-top"
                    >
                        <b-text
                            :is-loading="isFirstLoading"
                            :value="value"
                        />
                    </portal-form-item>
                </portal-card>

                <chat-container
                    v-if="ticketDetails.timeline.length && hasMessages"
                    class="mb-x2"
                    ref="chatRef"
                >
                    <div
                        v-for="(item, idx) in ticketDetails.timeline"
                        :key="idx"
                    >
                        <template v-if="item.type === TicketMessageType.Message && (item.text || item.files.length)">
                            <chat-message
                                :type="getChatMessageType(item)"
                                :name="item.user.name"
                                :login="item.user.login"
                                :text="item.text"
                                :stamp="item.created_at"
                                rounded
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

                        <template v-else-if="item.type === TicketMessageType.Event">
                            <chat-message
                                avatar="avatars/barber_system.png"
                                :type="ChatMessageType.System"
                                :name="t('mc.partner.assistant')"
                                :text="formatChanges(item)"
                                :stamp="item.created_at"
                            />
                        </template>
                    </div>
                </chat-container>

                <div
                    v-if="isEditable"
                    class="grid grid-reset-rows gap-x-2 gap-y-3"
                >
                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.general.placeholder.message')"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.general.placeholder.files')"
                            name="files"
                            class="files"
                        />
                    </div>

                    <div
                        v-if="!isFirstLoading"
                        class="col-12"
                    >
                        <div class="footer">
                            <b-button
                                :label="t('mc.common.send')"
                                :disabled="isDisabled"
                                :loading="loadingState === LoadingState.Save"
                                width-full
                                class="flex-2"
                                @click="onSave"
                            />
                            <b-button
                                label="Закрыть"
                                :disabled="isDisabled"
                                :loading="loadingState === LoadingState.Remove"
                                variant="danger"
                                width-full
                                class="flex-1"
                                @click="onRemove"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.ticket-edit-view {
    margin-bottom: $indent-x4;

    :deep(.portal-card) {
        padding: 0;
        background: transparent;

        .card-title {
            @include h4();
        }
    }

    .footer {
        display: flex;
        gap: $indent-x1;

        .flex-1 {
            flex: 1;
        }

        .flex-2 {
            flex: 2;
        }
    }
}
</style>
