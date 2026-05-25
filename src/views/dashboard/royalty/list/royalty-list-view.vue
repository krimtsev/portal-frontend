<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useRoyaltyStore } from "@s/dashboard/royalty/royalty.ts"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as royaltyAPI from "@/api/modules/dashboard/royalty/royalty"
import BDatePicker from "@c/common/b-date-picker/b-date-picker.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BExport from "@c/common/b-export/b-export.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { RoyaltyListItem } from "@v/dashboard/royalty/list/definitions/royalty-list"
import { exportXLS } from "@v/dashboard/royalty/list/utils/royalty-list"
import {
    getAnalyticsStartDate,
    getMonthToYesterdayRange,
    getYesterdayDate,
} from "@/lib/date-helpers"


const notify = useNotify()
const { t, n } = useI18n()

const royaltyStore = useRoyaltyStore()
const minDate = ref(getAnalyticsStartDate())
const maxDate = ref(getYesterdayDate())

const royalty = ref<RoyaltyListItem[]>([])
const isExporting = ref(false)

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

onMounted(() => {
    royaltyStore.setIsLoading(true)

    royaltyStore.filter.filters.period = getMonthToYesterdayRange()

    // const [
    //     royaltyData,
    // ] = await Promise.all([
    //     royaltyAPI.list(royaltyStore.filter),
    // ])
    //
    // if (royaltyData instanceof HttpError) {
    //     notify.error()
    //     return
    // }
    //
    // royalty.value = royaltyData.list
    //
    // royaltyStore.setPagination(royaltyData.page)
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

async function onExportXLS() {
    isExporting.value = true

    try {
        const royaltyData = await royaltyAPI.exportData()

        if (royaltyData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(royaltyData)
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="royalty-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Период">
                {{ royaltyStore.filter.filters.period }}
                <b-date-picker
                    v-model="royaltyStore.filter.filters.period"
                    :placeholder="t('mc.ticket.certificate.placeholder.paymentDate')"
                    date-format="dd-mm-yy"
                    selection-mode="range"
                    class="filter-period"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: royaltyStore.isLoading || isExporting }"
                        :loading="{ xls: isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

                <b-toolbar-item>
                    <b-input-search
                        v-model="royaltyStore.filter.search"
                        :disabled="royaltyStore.isLoading"
                        placeholder="Найти филиал"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
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
                    field="name"
                    class="table-name"
                />

                <prime-column
                    header="Организация"
                    field="organization"
                    class="table-organization"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.organization" />
                    </template>
                </prime-column>

                <prime-column
                    header="ИНН"
                    field="inn"
                    class="table-inn"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.inn" />
                    </template>
                </prime-column>

                <prime-column
                    header="Номер договора"
                    field="contract_number"
                    class="table-contract-number"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.contract_number" />
                    </template>
                </prime-column>

                <prime-column
                    header="Телефон"
                    field="mango_telnum"
                    class="table-mango-telnum"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.mango_telnum" />
                    </template>
                </prime-column>

                <prime-column
                    header="Yclients"
                    field="yclients_id"
                    class="table-yclients-id"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.yclients_id" />
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
    }

    .filter {
        &-period {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
