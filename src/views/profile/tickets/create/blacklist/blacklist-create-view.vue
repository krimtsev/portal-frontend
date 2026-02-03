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
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import { isEqual, cloneDeep } from "lodash"
import { useZodResolver } from "@/composables/zod/use-zod-resolver"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import { HttpError } from "@/api"
import type { TicketBlacklist } from "@v/profile/tickets/create/blacklist/definitions/blacklist"
import {
    type FormSchemaType,
    FormSchema,
} from "@v/profile/tickets/create/blacklist/schemas/blacklist.schema"
import BInputTelnum from "@c/common/b-input-telnum/b-input-telnum.vue"
import {
    type TicketCategoriesItem,
    TicketCategorySlug
} from "@v/profile/tickets/edit/definitions/ticket-category"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   []
})

const ticketCategory = ref<TicketCategoriesItem>()

function defaultState(): TicketBlacklist {
    return {
        title:       t("mc.ticket.blacklist.title"),
        type:        TicketType.Blacklist,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            name:     "",
            duration: "",
            phone:    "",
        },
    }
}

const initialState = ref<TicketBlacklist>(defaultState())
const currentState = ref<TicketBlacklist>(defaultState())

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
    params.title = t("mc.ticket.blacklist.title")

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
        :title="t('mc.ticket.blacklist.title')"
        right-image="template/ticket-blacklist.png"
        class="blacklist-create-view"
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
                            v-model="currentState.attributes.name"
                            :error="errors.attributes?.name"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.name')"
                            name="name"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="currentState.attributes.phone"
                            :error="errors.attributes?.phone"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.phone')"
                            name="phone"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="currentState.attributes.duration"
                            :error="errors.attributes?.duration"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.duration')"
                            name="duration"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="currentState.message"
                            :error="errors.message"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.message')"
                            full-width
                            name="message"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="currentState.files"
                            :error="errors.files"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.files')"
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

            <portal-card title="Регламент для занесения в чёрный список">
                <div class="content">
                    <p>
                        Чёрный список создан для того, чтобы обезопасить наших партнёров от сомнительных кадров,
                        которые могут навредить репутации бренда, филиалу, коллективу, клиентам и владельцу.
                    </p>
                </div>
            </portal-card>

            <portal-card title="В чёрный список можно занести сотрудника по причинам:">
                <div class="content">
                    <ol>
                        <li>Нахождение на рабочем месте в состоянии алкогольного или наркотического
                            опьянения (с предоставлением доказательства систематических нарушений).
                        </li>
                        <li>
                            Прямой умышленный саботаж коллектива (Пример: сотрудник пытается перейти в другой
                            салон и призывает команду идти за ним)
                        </li>
                        <li>Намеренный сбор клиентской базы, хищение/продажа.</li>
                        <li>Махинация с финансами и финансовыми операциями.</li>
                        <li>Махинации и сговор сотрудников барбершопа против интересов работодателя.</li>
                        <li>Хищение имущества у владельца или коллектива.</li>
                        <li>Разглашение конфиденциальной информации и интеллектуальной собственности бренда.</li>
                        <li>Присвоение денежных средств клиентов.</li>
                        <li>Искажение отчетной информации.</li>
                        <li>Целенаправленное нанесение материального ущерба работодателю.</li>
                        <li>Параллельная работа в конкурирующем салоне.</li>
                    </ol>
                </div>
            </portal-card>

            <portal-card title="При наличии личностной неприязни со стороны владельца, руководителя либо коллектива по отношению к сотруднику внесение его в чёрный список запрещено.">
                <div class="content">
                    <ol>
                        <li>
                            Занесение в чёрный список происходит после одобрения ЦО! В случае сложных,
                            спорных ситуаций, не соответствующих пр авилам выше сотрудник и владелец/руководитель
                            филиала вызываются в ЦО.
                        </li>
                        <li>
                            Заявка на чёрный список рассматривается с приложением доказательств
                            в виде скриншотов/видеофиксации/фотофиксации.
                        </li>
                        <li>Без доказательств заявка не рассматривается.</li>
                        <li>Срок рассмотрения заявки 14 рабочих дней.</li>
                        <li>В заявке обязательно указываем номер телефона, имя и фамилию сотрудника.</li>
                    </ol>
                </div>
            </portal-card>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.blacklist-create-view {
    margin-bottom: $indent-x4;

    .form {
        margin-bottom: $indent-x2;
    }

    .content {
        @include text-content;
    }
}
</style>
