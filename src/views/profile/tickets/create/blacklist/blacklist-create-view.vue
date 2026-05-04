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
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import BlacklistDescription from "@v/profile/tickets/create/blacklist/components/blacklist-description.vue"
import type { TicketBlacklist } from "@v/profile/tickets/create/blacklist/definitions/blacklist"
import { FormSchema } from "@v/profile/tickets/create/blacklist/schemas/blacklist.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import {
    type TicketCategoriesItem,
    TicketCategorySlug,
} from "@v/profile/tickets/edit/definitions/ticket-category"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
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

const isDisabled = computed(() => isFirstLoading.value || isLoading.value)

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
    setFieldValue,
} = useVeeForm<TicketBlacklist>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [nameModel] = defineLazyField("attributes.name")
const [phoneModel] = defineLazyField("attributes.phone")
const [durationModel] = defineLazyField("attributes.duration")

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
        :title="t('mc.ticket.blacklist.title')"
        right-image="template/ticket-blacklist.png"
        class="blacklist-create-view"
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
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.name')"
                            name="name"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="phoneModel"
                            :error="errors['attributes.phone']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.phone')"
                            name="phone"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="durationModel"
                            :error="errors['attributes.duration']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.duration')"
                            name="duration"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.message')"
                            :maxlength="maxMessageLength"
                            name="message"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="filesModel"
                            :error="errors['files']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.blacklist.placeholder.files')"
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

            <blacklist-description />
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
