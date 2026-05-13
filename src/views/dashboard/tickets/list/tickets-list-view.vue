<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useTicketsStore } from "@s/dashboard/tickets/tickets"
import { useDepartmentStore } from "@s/department/department"
import { useNotify } from "@/composables/notify/use-notify"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as ticketsAPI from "@/api/modules/dashboard/tickets/tickets"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BExport from "@c/common/b-export/b-export.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"
import { exportXLS } from "@v/dashboard/tickets/list/utils/tickets"
import { checkActiveState } from "@v/profile/tickets/edit/utils/ticket"
import TicketStateBadge from "@v/profile/tickets/list/components/ticket-state-badge.vue"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import { stateList } from "@v/profile/tickets/list/utils/ticket"


const notify = useNotify()
const router = useRouter()
const { t, n } = useI18n()

const ticketsStore = useTicketsStore()
const departmentStore = useDepartmentStore()

const ticketStateList = stateList()
const tickets = ref<TicketListItem[]>([])
const partners = ref<PartnerOptionItem[]>([])
const isExporting = ref(false)

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(ticketsStore.pagination.from),
            to:    n(ticketsStore.pagination.to),
            total: n(ticketsStore.pagination.total),
        },
        Number(ticketsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (ticketsStore.filter.page - 1) * ticketsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!tickets.value.length && ticketsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (ticketsStore.isLoading) return

    ticketsStore.setPage(page + 1)
    refreshTickets()
}

onMounted(async () => {
    ticketsStore.setIsLoading(true)

    const [
        ticketsData,
        partnersData,
    ] = await Promise.all([
        ticketsAPI.list(ticketsStore.filter),
        partnersAPI.options(),
    ])

    if (
        ticketsData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    tickets.value = ticketsData.list
    partners.value = partnersData.list

    ticketsStore.setPagination(ticketsData.page)
    ticketsStore.setIsLoading(false)
})

async function refreshTickets() {
    ticketsStore.setIsLoading(true)

    const ticketsData = await ticketsAPI.list(ticketsStore.filter)

    if (ticketsData instanceof HttpError) {
        notify.error()
        ticketsStore.setIsLoading(false)
        return
    }

    tickets.value = ticketsData.list
    ticketsStore.setPagination(ticketsData.page)
    ticketsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!ticketsStore.isChanged) return

    ticketsStore.resetPage()
    ticketsStore.commitFilter()

    refreshTickets()
}

function onClick(id: number, event: MouseEvent) {
    if (event.ctrlKey || event.metaKey) {
        const route = router.resolve({
            name:   DashboardRouteName.DashboardTicket,
            params: { id },
        })

        window.open(route.href, "_blank")
        return
    }

    router.push({ name: DashboardRouteName.DashboardTicket, params: { id } })
}

async function onExportXLS() {
    isExporting.value = true

    try {
        const ticketsData = await ticketsAPI.exportData()

        if (ticketsData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(ticketsData)
    } finally {
        isExporting.value = false
    }
}

const departmentName = (id: number) => departmentStore.getTitleById(id)
</script>

<template>
    <div class="tickets-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Отдел">
                <b-multi-select
                    v-model="ticketsStore.filter.filters.department_id"
                    :options="departmentStore.options"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.department_id.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
                    option-label="title"
                    option-value="id"
                    filter
                    show-clear
                    placeholder="Выберите отдел"
                    class="filter-department"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="ticketsStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.partner_id.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    placeholder="Выберите филиал"
                    class="filter-partner"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Статус">
                <b-multi-select
                    v-model="ticketsStore.filter.filters.state"
                    :options="ticketStateList"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.state.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
                    option-label="label"
                    option-value="value"
                    filter
                    show-clear
                    placeholder="Выберите статус"
                    class="filter-state"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: ticketsStore.isLoading || isExporting }"
                        :loading="{ xls: isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

                <b-toolbar-item>
                    <b-input-search
                        v-model="ticketsStore.filter.search"
                        :disabled="ticketsStore.isLoading"
                        placeholder="Найти заявку"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="ticketsStore.isLoading" />

            <b-empty-result
                v-else-if="!ticketsStore.isLoading && !tickets.length"
                title="Нет заявок"
            />

            <prime-data-table
                v-else
                :value="tickets"
                :rows="ticketsStore.pagination.perPage"
                :total-records="ticketsStore.pagination.total"
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
                    field="id"
                    header="#"
                    class="table-id"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.id" />
                    </template>
                </prime-column>

                <prime-column
                    header="Тема запроса"
                    field="title"
                    class="table-title link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.title"
                            @click="(e: MouseEvent) => onClick(data?.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Отдел"
                    field="department"
                    class="table-department"
                >
                    <template #body="{ data }">
                        <b-table-text :text="departmentName(data?.department_id)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner"
                    class="table-partner"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.partner.name" />
                    </template>
                </prime-column>

                <prime-column
                    header="Статус"
                    field="state"
                    class="table-state"
                >
                    <template #body="{ data }">
                        <ticket-state-badge :value="data?.state" />
                    </template>
                </prime-column>

                <prime-column
                    header="Активность"
                    field="last_message_at"
                    class="table-last-message-at"
                >
                    <template #body="{ data }">
                        <b-text-date
                            :value="checkActiveState(data?.state)
                                ? data?.last_message_at
                                : ''
                            "
                            diff
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата создания"
                    field="created_at"
                    class="table-created-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.created_at" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tickets-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table {
            &-id {
                @include col-fixed(80px);
            }
            &-title {
                @include col-fixed(300px);
            }
        }
    }

    .filter {
        &-department,
        &-partner,
        &-state {
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
