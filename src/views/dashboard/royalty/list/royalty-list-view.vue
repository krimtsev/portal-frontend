<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useRoyaltyStore } from "@s/dashboard/royalty/royalty"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as royaltyAPI from "@/api/modules/dashboard/royalty/royalty"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BTextDate from "@c/common/b-text-date/b-text-date.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"
import type { RoyaltyListItem } from "@v/dashboard/royalty/list/definitions/royalty-list"
import {
    formatDateToString,
    getAnalyticsStartDate,
    getPreviousMonth,
    parseStringToDate,
} from "@/lib/date-helpers"


const notify = useNotify()
const { t, n } = useI18n()

const royaltyStore = useRoyaltyStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getPreviousMonth())

const royalty = ref<RoyaltyListItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(royaltyStore.pagination.from),
            to:    n(royaltyStore.pagination.to),
            total: n(royaltyStore.pagination.total),
        },
        Number(royaltyStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (royaltyStore.filter.page - 1) * royaltyStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!royalty.value.length && royaltyStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (royaltyStore.isLoading) return

    royaltyStore.setPage(page + 1)
    refreshRoyalty()
}

onMounted(async () => {
    royaltyStore.setIsLoading(true)

    const [
        royaltyData,
        partnersData,
    ] = await Promise.all([
        royaltyAPI.list(royaltyStore.filter),
        partnersAPI.options(),
    ])

    if (
        royaltyData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    royalty.value = royaltyData.list
    partners.value = partnersData.list

    royaltyStore.setPagination(royaltyData.page)
    royaltyStore.setIsLoading(false)
})

async function refreshRoyalty() {
    royaltyStore.setIsLoading(true)

    const royaltyData = await royaltyAPI.list(royaltyStore.filter)

    if (royaltyData instanceof HttpError) {
        notify.error()
        royaltyStore.setIsLoading(false)
        return
    }

    royalty.value = royaltyData.list
    royaltyStore.setPagination(royaltyData.page)
    royaltyStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!royaltyStore.isChanged) return

    royaltyStore.resetPage()
    royaltyStore.commitFilter()

    refreshRoyalty()
}

const filterDate = computed({
    get: () => parseStringToDate(royaltyStore.filter.filters.date),
    set: (value) => {
        royaltyStore.filter.filters.date = formatDateToString(value, true)
    },
})
</script>

<template>
    <div class="royalty-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                <b-date-picker
                    v-model="filterDate"
                    :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                    date-format="MM yy"
                    :min-date="minDate"
                    :max-date="maxDate"
                    view="month"
                    :disabled="royaltyStore.isLoading"
                    class="filter-date"
                    @date-select="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="royaltyStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-count="royaltyStore.filter.filters.partner_id.length"
                    :disabled="royaltyStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    placeholder="Выберите филиал"
                    class="filter-partner"
                    @submit="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="royaltyStore.isLoading" />

            <b-empty-result
                v-else-if="!royaltyStore.isLoading && !royalty.length"
                title="Нет данных"
            />

            <prime-data-table
                v-else
                :value="royalty"
                :rows="royaltyStore.pagination.perPage"
                :total-records="royaltyStore.pagination.total"
                :first="firstPage"
                :paginator="showPaginator"
                class="table"
                @page="onPageChange"
                data-key="id"
                scrollable
                lazy
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <prime-column
                    header="Филиал"
                    field="partner_name"
                    class="table-name"
                />

                <prime-column
                    header="Валовая выручка"
                    field="gross_revenue"
                    class="table-gross-revenue"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.gross_revenue" />
                    </template>
                </prime-column>

                <prime-column
                    header="Роялти"
                    field="royalty_amount"
                    class="table-royalty-amount"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.royalty_amount" />
                    </template>
                </prime-column>

                <prime-column
                    header="Роялти %"
                    field="royalty_percent"
                    class="table-royalty-percent"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.royalty_percent" />
                    </template>
                </prime-column>

                <prime-column
                    header="НДС"
                    field="vat_amount"
                    class="table-vat-amount"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.vat_amount" />
                    </template>
                </prime-column>

                <prime-column
                    header="Роялти + НДС"
                    field="royalty_with_vat"
                    class="table-royalty-with-vat"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.royalty_with_vat" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата подписания"
                    field="start_at"
                    class="table-start-at"
                >
                    <template #body="{ data }">
                        <b-text-date
                            :value="data?.start_at"
                            show-format="yyyy-MM-dd"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Дней"
                    field="days_count"
                    class="table-days-count"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.days_count" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.royalty-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table-royalty-with-vat {
            color: var(--p-orange-300);
        }
    }

    .filter {
        &-date,
        &-partner {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
