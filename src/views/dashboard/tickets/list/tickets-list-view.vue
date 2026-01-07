<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PrimeMultiSelect from "primevue/multiselect"
import PrimeDataTable, { type DataTableRowSelectEvent } from "primevue/datatable"
import PrimeColumn from "primevue/column"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import { useI18n } from "vue-i18n"
import { type TicketCategoriesItem } from "@v/profile/tickets/edit/definitions/ticket-category"
import * as ticketsAPI from "@/api/modules/dashboard/tickets/tickets"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouter } from "vue-router"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import { defaultPaginationFilter, defaultPaginationPage } from "@/shared/pagination/pagination"
import BText from "@c/common/b-text/b-text.vue"
import { DashboardRouteName } from "@r/dashboard/route-names"
import TicketStateBadge from "@v/profile/tickets/list/components/ticket-state-badge.vue"
import { stateList } from "@v/profile/tickets/list/utils/ticket"
import { cloneDeep, isEqual } from "lodash"
import type { PartnerShortListItem } from "@v/dashboard/partners/definitions/partners"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue";
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue";


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()

const isLoading = ref(true)

const tickets = ref<TicketListItem[]>([])
const categories = ref<TicketCategoriesItem[]>([])
const partners = ref<PartnerShortListItem[]>([])

const paginationFilter = ref(defaultPaginationFilter({
    filters: {
        category_id: [],
        partner_id: [],
        state: []
    }
}))

const appliedFilters = ref(cloneDeep(paginationFilter.value.filters))

const paginationPage = ref(defaultPaginationPage({
    perPage: 20
}))

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from: n(paginationPage.value.from),
            to: n(paginationPage.value.to),
            total: n(paginationPage.value.total),
        },
        Number(paginationPage.value.total),
    )
})

const firstPage = computed(() => {
    return (paginationFilter.value.page - 1) * paginationPage.value.perPage
})

const showPaginator = computed(() => {
    return !!tickets.value.length &&
        paginationPage.value.total > paginationPage.value.perPage
})

function onPageChange({ page }: { page: number }) {
    paginationFilter.value.page = page + 1
    refreshTickets()
}

onMounted(async () => {
    isLoading.value = true

    const [
        ticketsData,
        categoriesData,
        partnersData
    ] = await Promise.all([
        ticketsAPI.list(paginationFilter.value),
        ticketsAPI.categories(),
        partnersAPI.shortList()
    ])

    if (
        ticketsData instanceof HttpError ||
        categoriesData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    tickets.value = ticketsData.list
    categories.value = categoriesData.list
    partners.value = partnersData.list


    paginationPage.value = ticketsData.page

    isLoading.value = false
})

async function refreshTickets() {
    isLoading.value = true

    const ticketsData = await ticketsAPI.list(paginationFilter.value)

    if (ticketsData instanceof HttpError) {
        notify.error()
        isLoading.value = false
        return
    }

    tickets.value = ticketsData.list
    paginationPage.value = ticketsData.page

    isLoading.value = false
}

const ticketStateList = stateList()

function onChangeFilter() {
    if (isEqual(paginationFilter.value.filters, appliedFilters.value)) {
        return
    }

    appliedFilters.value = cloneDeep(paginationFilter.value.filters)

    paginationFilter.value.page = 1
    refreshTickets()
}

const onRowSelect = (value: DataTableRowSelectEvent) => {
    router.push({ name: DashboardRouteName.DashboardTicket, params: { id: value.data.id } })
}
</script>

<template>
    <div class="ticket-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Отдел">
                <prime-multi-select
                    v-model="paginationFilter.filters.category_id"
                    :options="categories"
                    :selected-items-label="t('mc.select.elements', paginationFilter.filters.category_id.length)"
                    :max-selected-labels="1"
                    :disabled="isLoading"
                    option-label="title"
                    option-value="id"
                    filter
                    placeholder="Выберите отдел"
                    class="categories"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <prime-multi-select
                    v-model="paginationFilter.filters.partner_id"
                    :options="partners"
                    :selected-items-label="t('mc.select.elements', paginationFilter.filters.partner_id.length)"
                    :max-selected-labels="1"
                    :disabled="isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите филиал"
                    class="partner"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Статаус">
                <prime-multi-select
                    v-model="paginationFilter.filters.state"
                    :options="ticketStateList"
                    :selected-items-label="t('mc.select.elements', paginationFilter.filters.state.length)"
                    :max-selected-labels="1"
                    :disabled="isLoading"
                    option-label="label"
                    option-value="value"
                    filter
                    placeholder="Выберите статус"
                    class="state"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>
        </b-toolbar>

        <div class="table-wrapper">
            <prime-data-table
                :value="tickets"
                :rows="paginationPage.perPage"
                :total-records="paginationPage.total"
                :first="firstPage"
                :paginator="showPaginator"
                class="table"
                @page="onPageChange"
                @rowSelect="onRowSelect"
                selectionMode="single"
                dataKey="id"
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <template v-if="isLoading">
                    <list-loading-state />
                </template>

                <template v-else-if="!isLoading && !tickets.length">
                    <b-empty-result />
                </template>

                <template v-else>
                    <prime-column
                        field="id"
                        header="#"
                        class="table-id"
                    />

                    <prime-column
                        field="title"
                        header="Тема запроса"
                        class="table-subject"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.title" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="category"
                        header="Отдел"
                        class="table-category"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.category?.title" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="partner"
                        header="Филиал"
                        class="table-partner"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data?.partner?.name" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="state"
                        header="Статус"
                        class="table-state"
                    >
                        <template #body="slotProps">
                            <ticket-state-badge :value="slotProps.data.state" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="created_at"
                        header="Дата создания"
                        class="table-date"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data.created_at" />
                        </template>
                    </prime-column>
                </template>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.ticket-view {
    @include list-view;

    padding-top: $indent-x2;

    .categories,
    .partner,
    .state {
        @include col-width(250px);
    }

    .table-wrapper {
        margin-top: $indent-x2;
    }
}
</style>
