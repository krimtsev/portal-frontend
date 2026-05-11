<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { cloneDeep, isEqual } from "lodash"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import PrimeFloatLabel from "primevue/floatlabel"
import PrimeMultiSelect from "primevue/multiselect"
import { useNotify } from "@/composables/notify/use-notify"
import { ProfileRouteName } from "@r/profile/route-names"
import { HttpError } from "@/api"
import * as ticketsAPI from "@/api/modules/profile/tickets/tickets"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { departmentName, departmentsList } from "@v/dashboard/users/list/utils/users"
import { TicketState, TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import TicketStateBadge from "@v/profile/tickets/list/components/ticket-state-badge.vue"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import { defaultPaginationFilter, defaultPaginationPage } from "@/shared/pagination/pagination"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(true)

const tickets = ref<TicketListItem[]>([])
const paginationFilter = ref(defaultPaginationFilter({
    filters: {
        department: [],
    },
}))
const paginationPage = ref(defaultPaginationPage({
    perPage: 20,
}))
const prevPaginationFilter = ref(cloneDeep(paginationFilter.value))

onMounted(() => {
    isFirstLoading.value = true
    getData()
})

const setInitialData = () => {
    tickets.value = new Array(paginationPage.value.perPage).fill({
        id:         0,
        title:      "",
        type:       TicketType.General,
        department: null,
        partner:    null,
        user:       null,
        state:      TicketState.New,
    })
}

async function getData() {
    isLoading.value = true
    setInitialData()

    const [
        ticketData,
    ] = await Promise.all([
        ticketsAPI.list(paginationFilter.value),
    ])

    if (ticketData instanceof HttpError) {
        notify.error()
        return false
    }

    tickets.value = ticketData.list
    paginationPage.value = ticketData.page

    isLoading.value = false
    isFirstLoading.value = false
}

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(paginationPage.value.from),
            to:    n(paginationPage.value.to),
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
    getData()
}

function onChangeFilter() {
    const currentFilters = paginationFilter.value.filters
    const prevFilters = prevPaginationFilter.value.filters

    let hasChanged = false

    for (const key in currentFilters) {
        const currentValue = currentFilters[key]
        const prevValue = prevFilters[key]

        if (Array.isArray(currentValue)) {
            if (!isEqual(currentValue, prevValue)) {
                hasChanged = true
                break
            }
        } else {
            if (currentValue !== prevValue) {
                hasChanged = true
                break
            }
        }
    }

    if (!hasChanged) return

    paginationFilter.value.page = 1
    prevPaginationFilter.value = cloneDeep(paginationFilter.value)

    getData()
}

const isDisabled = computed(() => {
    return isFirstLoading.value || isLoading.value
})

const goTo = (id: string) => router.push({ name: ProfileRouteName.ProfileTicket, params: { id } })
</script>

<template>
    <portal-page
        title="Список заявок"
        class="tickets-list-view"
    >
        <div class="filter">
            <prime-float-label variant="on">
                <prime-multi-select
                    v-model="paginationFilter.filters.department"
                    :options="departmentsList"
                    filter
                    :disabled="isDisabled"
                    :max-selected-labels="1"
                    option-label="name"
                    option-value="id"
                    class="filter-department"
                    selected-items-label="{0} выбрано"
                    append-to="self"
                    input-id="department"
                    @hide="onChangeFilter"
                />
                <label for="department">Отдел</label>
            </prime-float-label>
        </div>

        <div class="content">
            <prime-data-table
                :value="tickets"
                :rows="paginationPage.perPage"
                :total-records="paginationPage.total"
                :loading="isLoading"
                :first="firstPage"
                :paginator="showPaginator"
                show-gridlines
                lazy
                class="table"
                @page="onPageChange"
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <template #loading />

                <template #empty>
                    <b-empty-result />
                </template>

                <prime-column
                    header="#"
                    field="id"
                    class="table-id"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.id" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Тема запроса"
                    field="title"
                    class="table-title link-text"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text
                                :text="data?.title"
                                @click="goTo(data?.id)"
                            />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Отдел"
                    field="department"
                    class="table-department"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="departmentName(data?.department)" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner"
                    class="table-partner"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.partner?.name" />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Статус"
                    field="state"
                    class="table-state"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <ticket-state-badge
                                :value="data?.state"
                                rounded
                            />
                        </b-skeleton>
                    </template>
                </prime-column>

                <prime-column
                    header="Дата создания"
                    field="created_at"
                    class="table-create-date"
                >
                    <template #body="{ data }">
                        <b-skeleton
                            :is-loading="isLoading"
                            full-width
                        >
                            <b-table-text :text="data?.created_at" />
                        </b-skeleton>
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.tickets-list-view {
    .filter {
        margin-bottom: $indent-x2;

        &-department {
            @include col-width(250px);
        }
    }

    :deep(.p-datatable) {
        @include table-outer-header;
        @include table;

        .table {
            &-id {
                @include col-fixed(80px);
            }

            &-state {
                @include col-fixed(130px);
            }

            &-title {
                @include col-fixed(300px);
            }

            &-partner,
            &-department {
                @include col-fixed(250px);
            }
        }
    }

    :deep(.p-multiselect) {
        .p-inputtext {
            padding-block: 0.5rem;
        }
    }
}
</style>
