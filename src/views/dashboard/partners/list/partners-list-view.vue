<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePartnersStore } from "@s/dashboard/partners/partners"
import { useNotify } from "@/composables/notify/use-notify"
import { useOpenRoute } from "@/composables/route/use-open-route"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BExport from "@c/common/b-export/b-export.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import PartnerStateTag from "@v/dashboard/partners/list/components/partner-state-tag.vue"
import { type PartnerListItem } from "@v/dashboard/partners/list/definitions/partners"
import { exportXLS, stateList } from "@v/dashboard/partners/list/utils/partners"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { openRoute } = useOpenRoute()

const partnersStore = usePartnersStore()

const partners = ref<PartnerListItem[]>([])
const isExporting = ref(false)

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(partnersStore.pagination.from),
            to:    n(partnersStore.pagination.to),
            total: n(partnersStore.pagination.total),
        },
        Number(partnersStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (partnersStore.filter.page - 1) * partnersStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!partners.value.length && partnersStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (partnersStore.isLoading) return

    partnersStore.setPage(page + 1)
    refreshPartners()
}

onMounted(async () => {
    partnersStore.setIsLoading(true)

    const [
        partnersData,
    ] = await Promise.all([
        partnersAPI.list(partnersStore.filter),
    ])

    if (partnersData instanceof HttpError) {
        notify.error()
        return
    }

    partners.value = partnersData.list

    partnersStore.setPagination(partnersData.page)
    partnersStore.setIsLoading(false)
})

async function refreshPartners() {
    partnersStore.setIsLoading(true)

    const partnersData = await partnersAPI.list(partnersStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        partnersStore.setIsLoading(false)
        return
    }

    partners.value = partnersData.list
    partnersStore.setPagination(partnersData.page)
    partnersStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnersStore.isChanged) return

    partnersStore.resetPage()
    partnersStore.commitFilter()

    refreshPartners()
}

function onClick(id: string, event: MouseEvent) {
    openRoute(
        {
            name:   DashboardRouteName.DashboardPartner,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardPartner,
        params: { id: "!new" },
    })
}

async function onExportXLS() {
    isExporting.value = true

    try {
        const partnersData = await partnersAPI.exportData()

        if (partnersData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(partnersData)
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="partners-list-view">
        <b-toolbar
            no-paddings
            :show-more="!partnersStore.isLoading"
        >
            <b-toolbar-item header="Статус">
                <b-multi-select
                    v-model="partnersStore.filter.filters.disabled"
                    :options="stateList"
                    :selected-count="partnersStore.filter.filters.disabled.length"
                    :disabled="partnersStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    placeholder="Выберите статус"
                    class="filter-state"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <template #more>
                <b-toolbar-item>
                    <b-button-secondary
                        label="Добавить филиал"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: partnersStore.isLoading || isExporting }"
                        :loading="{ xls: isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

                <b-toolbar-item>
                    <b-input-search
                        v-model="partnersStore.filter.search"
                        :disabled="partnersStore.isLoading"
                        placeholder="Найти филиал"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="partnersStore.isLoading" />

            <b-empty-result
                v-else-if="!partnersStore.isLoading && !partners.length"
                title="Нет филиалов"
            />

            <prime-data-table
                v-else
                :value="partners"
                :rows="partnersStore.pagination.perPage"
                :total-records="partnersStore.pagination.total"
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
                    class="table-name link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.name"
                            @click="(e: MouseEvent) => onClick(data?.id, e)"
                        />
                    </template>
                </prime-column>

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
                    header="Статус"
                    field="disabled"
                    class="table-disabled"
                >
                    <template #body="{ data }">
                        <partner-state-tag :active="!data?.disabled" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата открытия"
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
.partners-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;
    }

    .filter {
        &-state {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
