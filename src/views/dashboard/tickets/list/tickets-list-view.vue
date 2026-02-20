<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PrimeMultiSelect from "primevue/multiselect"
import PrimeDataTable from "primevue/datatable"
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
import BText from "@c/common/b-text/b-text.vue"
import { DashboardRouteName } from "@r/dashboard/route-names"
import TicketStateBadge from "@v/profile/tickets/list/components/ticket-state-badge.vue"
import { stateList } from "@v/profile/tickets/list/utils/ticket"
import type { PartnerShortListItem } from "@v/dashboard/partners/list/definitions/partners"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import { checkActiveState } from "@v/profile/tickets/edit/utils/ticket"
import { useTicketsStore } from "@s/dashboard/tickets/tickets"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const ticketsStore = useTicketsStore()

const ticketStateList = stateList()
const tickets = ref<TicketListItem[]>([])
const categories = ref<TicketCategoriesItem[]>([])
const partners = ref<PartnerShortListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from: n(ticketsStore.pagination.from),
            to: n(ticketsStore.pagination.to),
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
        categoriesData,
        partnersData
    ] = await Promise.all([
        ticketsAPI.list(ticketsStore.filter),
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

const onClick = (id: number, event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
        const route = router.resolve({
            name:   DashboardRouteName.DashboardTicket,
            params: { id }
        })

        window.open(route.href, "_blank")
        return
    }

    router.push({ name: DashboardRouteName.DashboardTicket, params: { id } })
}
</script>

<template>
    <div class="tickets-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Отдел">
                <prime-multi-select
                    v-model="ticketsStore.filter.filters.category_id"
                    :options="categories"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.category_id.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
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
                    v-model="ticketsStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.partner_id.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите филиал"
                    class="partner"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Статус">
                <prime-multi-select
                    v-model="ticketsStore.filter.filters.state"
                    :options="ticketStateList"
                    :selected-items-label="t('mc.select.elements', ticketsStore.filter.filters.state.length)"
                    :max-selected-labels="1"
                    :disabled="ticketsStore.isLoading"
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

                <template v-if="ticketsStore.isLoading">
                    <list-loading-state />
                </template>

                <template v-else-if="!ticketsStore.isLoading && !tickets.length">
                    <b-empty-result title="Нет заявок" />
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
                            <b-text
                                :value="slotProps.data?.title"
                                class="link-text"
                                @click="(e: MouseEvent) => onClick(slotProps.data.id, e)"
                            />
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
                        field="last_message_at"
                        header="Активность"
                        class="table-message-date"
                    >
                        <template #body="slotProps">
                            <b-text-date
                                v-if="checkActiveState(slotProps.data.state)"
                                :value="slotProps.data.last_message_at"
                                diff
                            />
                            <div v-else> — </div>
                        </template>
                    </prime-column>

                    <prime-column
                        field="created_at"
                        header="Дата создания"
                        class="table-create-date"
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
.tickets-list-view {
    @include list-view;

    padding-top: $indent-x2;

    :deep(.p-datatable) {
        @include table;
    }

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
