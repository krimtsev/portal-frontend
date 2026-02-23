<script setup lang="ts">
import { computed, nextTick, onMounted, ref, type ComponentPublicInstance } from "vue"
import BForm from "@c/common/b-form/b-form.vue"
import BFormCard from "@c/common/b-form/b-form-card.vue"
import BFormItem from "@c/common/b-form/b-form-item.vue"
import ChatMessage from "@c/chat/chat-message.vue"
import ChatContainer from "@c/chat/chat-container.vue"
import ChatFiles from "@c/chat/chat-files.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import { dashboardPaths } from "@r/dashboard/path"
import { stateList } from "@v/profile/tickets/list/utils/ticket"
import type { TicketCategoriesItem } from "@v/profile/tickets/edit/definitions/ticket-category"
import type { PartnerShortListItem } from "@v/dashboard/partners/list/definitions/partners"
import * as ticketsAPI from "@/api/modules/dashboard/tickets/tickets"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { useRoute, useRouter } from "vue-router"
import {
    type TicketDetails,
    type TicketMessage,
    TicketMessageType,
    TicketState,
    TicketType,
} from "@v/profile/tickets/edit/definitions/ticket"
import type { TicketStateData } from "@v/dashboard/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"
import {
    type ChatMessageFile,
    ChatMessageType
} from "@c/chat/definitions/chat-message"
import {
    formatChanges,
    hasTimelineMessage,
    normalizeAttributes
} from "@v/profile/tickets/edit/utils/ticket"
import * as ticketAPI from "@/api/modules/dashboard/tickets/tickets"
import { downloadExternalFile } from "@/lib/files"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { useForm } from "vee-validate"
import { useConfigValidation } from "@/composables/vee-validate/use-config-validation"
import { ticketSchema } from "@v/dashboard/tickets/edit/schemas/ticket.schema"



const notify = useNotify()
const route = useRoute()
const router = useRouter()
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

const ticketDetails = ref<TicketDetails>({
    title:      "",
    type:       TicketType.General,
    category:   null,
    partner:    null,
    user:       null,
    state:      TicketState.New,
    attributes: {},
    timeline:   [],
})

const isFirstLoading = ref(true)
const isLoading = ref(false)
const isLoadingFile = ref(false)

const ticketStateList = stateList()
const ticketCategoriesList = ref<TicketCategoriesItem[]>([])
const partnersList = ref<PartnerShortListItem[]>([])

const ticketId = computed(() => route.params.id as string)

const {
    errors,
    resetForm,
    handleSubmit,
    defineField,
    meta,
    submitCount,
    setErrors
} = useForm<TicketStateData>({
    validationSchema: ticketSchema,
    initialValues:    defaultState(),
})

const dynamicConfig = useConfigValidation(submitCount)

const [titleModel]      = defineField("title", dynamicConfig)
const [partnerIdModel]  = defineField("partner_id", dynamicConfig)
const [categoryIdModel] = defineField("category_id", dynamicConfig)
const [stateModel]      = defineField("state", dynamicConfig)
const [messageModel]    = defineField("message", dynamicConfig)
const [filesModel]      = defineField("files", dynamicConfig)

const chatRef = ref<ComponentPublicInstance<{ scrollToBottom: () => void }> | null>(null)

onMounted(async () => {
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
        await router.push({ name: DashboardRouteName.DashboardTickets })
        return
    }

    ticketCategoriesList.value = categoriesData.list
    partnersList.value = partnersData.list

    ticketDetails.value = ticketData.data

    resetForm({
        values: {
            title:       ticketDetails.value.title,
            partner_id:  ticketDetails.value.partner?.id || null,
            category_id: ticketDetails.value.category?.id || null,
            type:        ticketDetails.value.type || TicketType.General,
            state:       ticketDetails.value.state,
            message:     "",
            files:       [],
        }
    })

    isFirstLoading.value = false
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

    const data = await ticketAPI.download(ticketId.value, item.name)

    if (data instanceof HttpError) {
        notify.error()
        isLoadingFile.value = false
        return false
    }

    const { title, ext } = item
    downloadExternalFile(data, `${title}.${ext}`)
    isLoadingFile.value = false
}

const onSave = handleSubmit(async (formValues) => {
    if (!meta.value.dirty) {
        notify.success(t("mc.notify.success"))
        await router.push({ name: DashboardRouteName.DashboardTickets })
        return
    }

    isLoading.value = true

    const ticketResponse = await ticketAPI.update(
        ticketId.value,
        formValues
    )

    isLoading.value = false

    if (ticketResponse instanceof HttpError) {
        if (ticketResponse?.errors) setErrors(ticketResponse.errors)
        notify.error()
        return
    }

    ticketDetails.value = ticketResponse.data

    await nextTick(() => chatRef.value?.scrollToBottom())
})
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
                <b-input-text
                    v-model="titleModel"
                    :disabled="isLoading"
                    :error="errors.title"
                />
            </b-form-item>

            <b-form-item
                label="Филиал"
                required
            >
                <b-select
                    v-model="partnerIdModel"
                    :options="partnersList"
                    :disabled="isLoading"
                    :error="errors.partner_id"
                    filter
                    option-label="name"
                    option-value="id"
                    placeholder="Выберите филиал"
                />
            </b-form-item>

            <b-form-item
                label="Отдел"
                required
            >
                <b-select
                    v-model="categoryIdModel"
                    :options="ticketCategoriesList"
                    :disabled="isLoading"
                    :error="errors.category_id"
                    filter
                    option-label="title"
                    option-value="id"
                    placeholder="Выберите отдел"
                />
            </b-form-item>

            <b-form-item
                label="Статус"
                required
            >
                <b-select
                    v-model="stateModel"
                    :options="ticketStateList"
                    :disabled="isLoading"
                    :error="errors.state"
                    filter
                    placeholder="Выберите статус"
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
                class="label-align-center short-gap"
            >
                <span> {{ value }} </span>
            </b-form-item>
        </b-form-card>

        <b-form-card>
            <b-form-item label="Чат">
                <chat-container
                    v-if="ticketDetails.timeline.length"
                    ref="chatRef"
                    :empty="!hasMessages"
                    class="chat"
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
            </b-form-item>

            <b-form-item
                label="Сообщение"
                required
            >
                <b-textarea
                    v-model="messageModel"
                    :disabled="isLoading"
                    :error="errors.message"
                    :rows="5"
                    class="message"
                    placeholder="Введите сообщение"
                />
            </b-form-item>

            <b-form-item label="Загрузить файл">
                <b-file-upload
                    v-model="filesModel"
                    :disabled="isLoading"
                    :error="errors.files"
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
    .chat,
    .message,
    .files {
        width: 100%;
    }
}
</style>
