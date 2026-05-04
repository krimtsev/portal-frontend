<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useNotify } from "@/composables/notify/use-notify"
import { useVeeForm } from "@/composables/vee-validate/use-validation"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import * as partnerAPI from "@/api/modules/partner/partner"
import { type UserPartners } from "@/api/modules/partner/partner"
import * as ticketAPI from "@/api/modules/profile/tickets/tickets"
import BButton from "@c/common/b-button/b-button.vue"
import BButtonGroups from "@c/common/b-button-groups/b-button-groups.vue"
import BInputTelnum from "@c/common/b-input/b-input-telnum.vue"
import BInputText from "@c/common/b-input/b-input-text.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTextarea from "@c/common/b-textarea/b-textarea.vue"
import BFileUpload from "@c/common/b-upload-file/b-file-upload.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { Qualification, type TicketSpecialist } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import { FormSchema } from "@v/profile/tickets/create/specialist/_britva/schemas/specialist.schema"
import { qualificationName } from "@v/profile/tickets/create/specialist/_britva/utils/specialist"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import {
    type TicketCategoriesItem,
    TicketCategorySlug,
} from "@v/profile/tickets/edit/definitions/ticket-category"
import { maxMessageLength } from "@v/profile/tickets/list/definitions/tickets-list"


const notify = useNotify()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

const ticketCategory = ref<TicketCategoriesItem>()

function defaultState(): TicketSpecialist {
    const queryQualification = route.query.qualification as string | undefined

    const qualification = queryQualification &&
        Object.values(Qualification).includes(queryQualification as Qualification)
            ? (queryQualification as Qualification)
            : Qualification.BarberPlus

    return {
        title:       t("mc.ticket.specialist.title"),
        type:        TicketType.Specialist,
        partner_id:  null,
        category_id: null,
        message:     "",
        files:       [],
        attributes:  {
            qualification,
            name:        "",
            phone:       "",
            experience:  "",
            statistics:  "",
            linkToWorks: "",
        },
    }
}

const qualificationItems = Object.values(Qualification).map(value => ({
    value,
    label: qualificationName(value),
}))

const isDisabled = computed(() => isFirstLoading.value || isLoading.value)

const {
    errors,
    handleSubmit,
    defineLazyField,
    meta,
    setErrors,
    setFieldValue,
} = useVeeForm<TicketSpecialist>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [nameModel] = defineLazyField("attributes.name")
const [phoneModel] = defineLazyField("attributes.phone")
const [qualificationModel] = defineLazyField("attributes.qualification")
const [experienceModel] = defineLazyField("attributes.experience")
const [linkToWorksModel] = defineLazyField("attributes.linkToWorks")
const [statisticsModel] = defineLazyField("attributes.statistics")


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
        :title="t('mc.ticket.specialist.title')"
        right-image="template/ticket-specialist.png"
        class="specialist-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">
                        <b-select
                            v-model="partnerIdModel"
                            :options="userPartners.partners"
                            :disabled="isFirstLoading"
                            :is-loading="isFirstLoading"
                            :error="errors['partner_id']"
                            :placeholder="t('mc.common.partner')"
                            option-label="name"
                            option-value="partner_id"
                            name="partner_id"
                            filter
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-12 py-x2">
                        <b-button-groups
                            v-model="qualificationModel"
                            :items="qualificationItems"
                            :disabled="isFirstLoading"
                            name="qualification"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.name')"
                            name="name"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="phoneModel"
                            :error="errors['attributes.phone']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.phone')"
                            name="phone"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="experienceModel"
                            :error="errors['attributes.experience']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.experience')"
                            name="experience"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="statisticsModel"
                            :error="errors['attributes.statistics']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.statistics')"
                            name="statistics"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="linkToWorksModel"
                            :error="errors['attributes.linkToWorks']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.linkToWorks')"
                            name="linkToWorks"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isFirstLoading"
                            :placeholder="t('mc.ticket.specialist.placeholder.message')"
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
                            :placeholder="t('mc.ticket.specialist.placeholder.files')"
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
.specialist-create-view {
    margin-bottom: $indent-x4;
}
</style>
