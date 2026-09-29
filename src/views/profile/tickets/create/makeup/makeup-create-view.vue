<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useDepartmentStore } from "@s/department/department"
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
import type { TicketMakeup } from "@v/profile/tickets/create/makeup/definitions/podolog.ts"
import { FormSchema } from "@v/profile/tickets/create/makeup/schemas/makeup.schema"
import { TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import { maxMessageLength } from "@/constants/messages"
import { DepartmentType } from "@/definitions/departments"


const notify = useNotify()
const router = useRouter()
const { t } = useI18n()

const departmentStore = useDepartmentStore()

const isFirstLoading = ref(true)
const isLoading = ref(false)

const userPartners = ref<UserPartners>({
    partner_id: null,
    partners:   [],
})

function defaultState(): TicketMakeup {
    return {
        title:         t("mc.ticket.makeup.title"),
        type:          TicketType.Makeup,
        partner_id:    null,
        department_id: departmentStore.getIdByType(DepartmentType.Franchise),
        message:       "",
        files:         [],
        attributes:    {
            name:        "",
            duration:    "",
            phone:       "",
            statistics:  "",
            linkToWorks: "",
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
} = useVeeForm<TicketMakeup>({
    validationSchema: FormSchema,
    initialValues:    defaultState(),
})

const [partnerIdModel] = defineLazyField("partner_id")
const [messageModel] = defineLazyField("message")
const [filesModel] = defineLazyField("files")
const [nameModel] = defineLazyField("attributes.name")
const [phoneModel] = defineLazyField("attributes.phone")
const [durationModel] = defineLazyField("attributes.duration")
const [statisticsModel] = defineLazyField("attributes.statistics")
const [linkToWorksModel] = defineLazyField("attributes.linkToWorks")

onMounted(async () => {
    isFirstLoading.value = true

    const [partners] = await Promise.all([
        partnerAPI.userPartners(),
    ])

    if (partners instanceof HttpError) {
        notify.error()
        return
    }

    userPartners.value = partners

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
        :title="t('mc.ticket.makeup.title')"
        class="makeup-create-view"
    >
        <div class="ticket-wrapper">
            <div class="form">
                <div class="grid grid-reset-rows gap-x-2 gap-y-3">
                    <div class="col-6 mobile-col-12">
                        <b-select
                            v-model="partnerIdModel"
                            :options="userPartners.partners"
                            :disabled="isDisabled"
                            :error="errors['partner_id']"
                            option-label="name"
                            option-value="partner_id"
                            :placeholder="t('mc.common.partner')"
                            full-width
                        />
                    </div>

                    <div class="col-6 mobile-hidden" />

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="nameModel"
                            :error="errors['attributes.name']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.name')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-telnum
                            v-model="phoneModel"
                            :error="errors['attributes.phone']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.phone')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="durationModel"
                            :error="errors['attributes.duration']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.duration')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="statisticsModel"
                            :error="errors['attributes.statistics']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.statistics')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-6 mobile-col-12">
                        <b-input-text
                            v-model="linkToWorksModel"
                            :error="errors['attributes.linkToWorks']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.specialist.placeholder.linkToWorks')"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-textarea
                            v-model="messageModel"
                            :error="errors['message']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.message')"
                            :maxlength="maxMessageLength"
                            class="full-width"
                        />
                    </div>

                    <div class="col-12 mobile-col-12">
                        <b-file-upload
                            v-model="filesModel"
                            :error="errors['files']"
                            :disabled="isDisabled"
                            :placeholder="t('mc.ticket.makeup.placeholder.files')"
                            class="full-width"
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
.makeup-create-view {
    margin-bottom: $indent-x4;

    .form {
        margin-bottom: $indent-x2;
    }

    .content {
        @include text-content;
    }
}
</style>
