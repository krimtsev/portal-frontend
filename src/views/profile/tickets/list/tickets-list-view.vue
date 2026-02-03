<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PrimeDataTable from "primevue/datatable"
import { defaultPaginationFilter, defaultPaginationPage } from "@/shared/pagination/pagination"
import * as ticketsAPI from "@/api/modules/profile/tickets/tickets"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { useI18n } from "vue-i18n"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import PrimeColumn from "primevue/column"
import BText from "@c/common/b-text/b-text.vue"
import type { TicketListItem } from "@v/profile/tickets/list/definitions/tickets-list"
import { useRouter } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"
import PrimeMultiSelect from "primevue/multiselect"
import PrimeFloatLabel from "primevue/floatlabel"
import type { TicketCategoriesItem } from "@v/profile/tickets/edit/definitions/ticket-category"
import { cloneDeep, isEqual } from "lodash"
import { TicketState, TicketType } from "@v/profile/tickets/edit/definitions/ticket"
import TicketStateBadge from "@v/profile/tickets/list/components/ticket-state-badge.vue"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()

const isFirstLoading = ref(true)
const isLoading = ref(true)

const tickets = ref<TicketListItem[]>([])
const categories = ref<TicketCategoriesItem[]>([])
const paginationFilter = ref(defaultPaginationFilter({
    filters: {
        category_id: [],
    }
}))
const paginationPage = ref(defaultPaginationPage({
    perPage: 20
}))
const prevPaginationFilter = ref(cloneDeep(paginationFilter.value))

onMounted(() => {
    isFirstLoading.value = true
    getData()
})

const setInitialData = () => {
    tickets.value = new Array(paginationPage.value.perPage).fill({
        id:       0,
        title:    "",
        type:     TicketType.General,
        category: null,
        partner:  null,
        user:     null,
        state:    TicketState.New
    })
}

async function getData() {
    isLoading.value = true
    setInitialData()

    const [
        ticketData,
        ticketCategoriesData,
    ] = await Promise.all([
        ticketsAPI.list(paginationFilter.value),
        isFirstLoading.value ? ticketsAPI.categories() : null
    ])

    if (
        ticketData instanceof HttpError ||
        ticketCategoriesData instanceof HttpError
    ) {
        notify.error()
        return false
    }

    tickets.value = ticketData.list
    paginationPage.value = ticketData.page

    if (ticketCategoriesData) {
        categories.value = ticketCategoriesData.list
    }

    isLoading.value = false
    isFirstLoading.value = false
}

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
                    v-model="paginationFilter.filters.category_id"
                    :options="categories"
                    filter
                    :disabled="isDisabled"
                    :loading="isFirstLoading"
                    :max-selected-labels="1"
                    option-label="title"
                    option-value="id"
                    class="category"
                    selectedItemsLabel="{0} выбрано"
                    append-to="self"
                    input-id="category"
                    @hide="onChangeFilter"
                />
                <label for="category">Отдел</label>
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
                    field="id"
                    class="id"
                    header="#"
                >
                    <template #body="slotProps">
                        <b-text
                            :is-loading="isLoading"
                            :value="slotProps.data.id"
                            preload-width="20px"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="title"
                    class="subject"
                    header="Тема запроса"
                >
                    <template #body="slotProps">
                        <b-text
                            :value="slotProps.data.title"
                            :is-loading="isLoading"
                            variant="link"
                            @click="goTo(slotProps.data.id)"
                            preload-width="180px"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="category"
                    class="category"
                    header="Отдел"
                >
                    <template #body="slotProps">
                        <b-text
                            :value="slotProps.data?.category?.title"
                            :is-loading="isLoading"
                            preload-width="120px"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="partner"
                    class="partner"
                    header="Филиал"
                >
                    <template #body="slotProps">
                        <b-text
                            :value="slotProps.data?.partner?.name"
                            :is-loading="isLoading"
                            preload-width="100px"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="state"
                    class="state"
                    header="Статус"
                >
                    <template #body="slotProps">
                        <ticket-state-badge
                            :is-loading="isLoading"
                            :value="slotProps.data.state"
                            rounded
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="created_at"
                    header="Дата создания"
                    class="table-create-date"
                >
                    <template #body="slotProps">
                        <b-text
                            :is-loading="isLoading"
                            :value="slotProps.data.created_at"
                            preload-width="120px"
                        />
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

        .category {
            @include col-width(250px);
        }
    }

    :deep(.p-datatable) {
        @include table-outer-header;

        .id {
            @include col-width(60px);
        }

        .state {
            @include col-width(130px);
        }

        .subject {
            min-width: 250px;
        }

        .partner,
        .category {
            @include col-width(250px);
        }

    }

    :deep(.p-multiselect) {
        .p-inputtext {
            padding-block: 0.5rem;
        }
    }
}
</style>
