<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeFloatLabel from "primevue/floatlabel"
import { useAuthStore } from "@s/auth/auth"
import { useTelnumsIncomingStore } from "@s/profile/telnums/telnums-incoming"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import type { UserPartnerItem } from "@/api/modules/partner/partner"
import * as partnerAPI from "@/api/modules/partner/partner"
import * as telnumsIncomingAPI from "@/api/modules/profile/telnums/telnums-incomgin"
import CallsPeriodChart from "@c/charts/calls-period-chart/calls-period-chart.vue"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import type { MangoCallsData } from "@v/dashboard/panel/definitions/panel"
import {
    formatJSDateToStringDate,
    formatStringDateToJSDate,
} from "@/lib/date-helpers"

const notify = useNotify()
const { t } = useI18n()

const authStore = useAuthStore()
const telnumsIncomingStore = useTelnumsIncomingStore()
const telnumsIncoming = ref<MangoCallsData[]>([])
const userPartners = ref<UserPartnerItem[]>([])

const dateRange = ref<Array<Date | null>>(committedRange())

onMounted(async () => {
    telnumsIncomingStore.setIsLoading(true)

    const userPartner = authStore.partner
    if (userPartner?.id) {
        telnumsIncomingStore.filter.filters.partner_id = userPartner.id
        userPartners.value = [{
            partner_id: userPartner.id,
            name:       userPartner.name,
        }]
    }

    const { partner_id, date_from, date_to } = telnumsIncomingStore.filter.filters
    const hasData = !!partner_id && !!date_from && !!date_to

    const [
        telnumsIncomingData,
        partnersResponse,
    ] = await Promise.all([
        hasData ? telnumsIncomingAPI.partnerPeriod(partner_id, { date_from, date_to }) : null,
        partnerAPI.userPartners(),
    ])

    if (
        telnumsIncomingData instanceof HttpError ||
        partnersResponse instanceof HttpError
    ) {
        notify.error()
        return
    }

    if (telnumsIncomingData) {
        telnumsIncoming.value = telnumsIncomingData.data
    }
    userPartners.value = partnersResponse.partners
    telnumsIncomingStore.setIsLoading(false)
})

async function refreshPage() {
    const { partner_id, date_from, date_to } = telnumsIncomingStore.filter.filters

    if (!partner_id || !date_from || !date_to) return

    telnumsIncomingStore.setIsLoading(true)

    const response = await telnumsIncomingAPI.partnerPeriod(partner_id, { date_from, date_to })

    if (response instanceof HttpError) {
        notify.error()
        telnumsIncomingStore.setIsLoading(false)
        return
    }

    telnumsIncoming.value = response.data
    telnumsIncomingStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!telnumsIncomingStore.isChanged) return

    telnumsIncomingStore.commitFilter()
    refreshPage()
}

const filterPartner = computed({
    get: () => {
        return telnumsIncomingStore.filter.filters.partner_id
    },
    set: (value: number | null) => {
        telnumsIncomingStore.filter.filters.partner_id = value
    },
})


function committedRange(): Array<Date | null> {
    const { date_from, date_to } = telnumsIncomingStore.filter.filters

    return [
        formatStringDateToJSDate(date_from),
        formatStringDateToJSDate(date_to),
    ]
}

function onDatePickerHide() {
    const [date_from, date_to] = dateRange.value

    if (!date_from) {
        dateRange.value = committedRange()
        return
    }

    const date_end = date_to ?? date_from
    dateRange.value = [date_from, date_end]

    telnumsIncomingStore.filter.filters.date_from = formatJSDateToStringDate(date_from)
    telnumsIncomingStore.filter.filters.date_to = formatJSDateToStringDate(date_end)

    onChangeFilter()
}
</script>

<template>
    <portal-page
        title="Входящие звонки"
        class="telnums-incoming-view"
        without-right-side
    >
        <b-toolbar
            no-paddings
            class="bg-transparent"
        >
            <b-toolbar-item>
                <prime-float-label variant="on">
                    <b-date-picker
                        v-model="dateRange"
                        selection-mode="range"
                        hide-on-range-selection
                        :placeholder="t('mc.common.placeholder.period')"
                        :disabled="telnumsIncomingStore.isLoading"
                        :max-range-days="31"
                        class="filter-date"
                        @hide="onDatePickerHide"
                    />
                    <label for="filter-date">Период</label>
                </prime-float-label>
            </b-toolbar-item>

            <b-toolbar-item>
                <prime-float-label variant="on">
                    <b-select
                        v-model="filterPartner"
                        :options="userPartners"
                        :disabled="telnumsIncomingStore.isLoading"
                        option-label="name"
                        option-value="partner_id"
                        filter
                        class="filter-partner"
                        @change="onChangeFilter"
                    />
                    <label for="filter-date">Филиал</label>
                </prime-float-label>
            </b-toolbar-item>
        </b-toolbar>

        <div class="chart-wrapper">
            <b-empty-result
                v-if="!telnumsIncomingStore.isLoading && !telnumsIncoming.length"
                title="Нет данных"
            />

            <calls-period-chart
                v-else
                title="Динамика звонков за 24 часа"
                :is-loading="telnumsIncomingStore.isLoading"
                :data="telnumsIncoming"
            />
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.telnums-incoming-view {
    .chart-wrapper {
        margin-top: $indent-x2;
    }

    .filter {
        margin-bottom: $indent-x2;

        &-date,
        &-partner {
            @include col-width(250px);
        }
    }


}
</style>
