<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useAuthStore } from "@s/auth/auth"
import { useEventCalendarStore } from "@s/dashboard/event-calendar/event-calendar"
import { useDepartmentStore } from "@s/department/department"
import { useNotify } from "@/composables/notify/use-notify"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as eventCalendarAPI from "@/api/modules/dashboard/event-calendar/event-calendar"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import type { EventCalendarListItem } from "@v/dashboard/event-calendar/list/definitions/event-calendar-list.ts"
import { formatStringToLocal } from "@/lib/date-helpers"


const notify = useNotify()
const router = useRouter()
const authStore = useAuthStore()
const { t, n } = useI18n()

const eventCalendarStore = useEventCalendarStore()
const departmentStore = useDepartmentStore()

const eventCalendar = ref<EventCalendarListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(eventCalendarStore.pagination.from),
            to:    n(eventCalendarStore.pagination.to),
            total: n(eventCalendarStore.pagination.total),
        },
        Number(eventCalendarStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (eventCalendarStore.filter.page - 1) * eventCalendarStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!eventCalendar.value.length && eventCalendarStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (eventCalendarStore.isLoading) return

    eventCalendarStore.setPage(page + 1)
    refreshEventCalendar()
}

onMounted(async () => {
    eventCalendarStore.setIsLoading(true)

    const eventCalendarResponse = await eventCalendarAPI.list(eventCalendarStore.filter)

    if (eventCalendarResponse instanceof HttpError) {
        notify.error()
        return
    }

    eventCalendar.value = eventCalendarResponse.list

    eventCalendarStore.setPagination(eventCalendarResponse.page)
    eventCalendarStore.setIsLoading(false)
})

async function refreshEventCalendar() {
    eventCalendarStore.setIsLoading(true)

    const eventCalendarResponse = await eventCalendarAPI.list(eventCalendarStore.filter)

    if (eventCalendarResponse instanceof HttpError) {
        notify.error()
        eventCalendarStore.setIsLoading(false)
        return
    }

    eventCalendar.value = eventCalendarResponse.list
    eventCalendarStore.setPagination(eventCalendarResponse.page)
    eventCalendarStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!eventCalendarStore.isChanged) return

    eventCalendarStore.resetPage()
    eventCalendarStore.commitFilter()

    refreshEventCalendar()
}

function onClick(id: number, event: MouseEvent) {
    if (event.ctrlKey || event.metaKey) {
        const route = router.resolve({
            name:   DashboardRouteName.DashboardEventCalendar,
            params: { id },
        })

        window.open(route.href, "_blank")
        return
    }

    router.push({ name: DashboardRouteName.DashboardEventCalendar, params: { id } })
}

const departmentName = (id: number) => departmentStore.getTitleById(id)

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardEventCalendar,
        params: { id: "!new" },
    })
}
</script>

<template>
    <div class="event-calendar-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item>
                <b-button-secondary
                    label="Добавить событие"
                    :disabled="eventCalendarStore.isLoading"
                    @click="goToNew"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="eventCalendarStore.filter.search"
                        :disabled="eventCalendarStore.isLoading"
                        placeholder="Найти тему события"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="eventCalendarStore.isLoading" />

            <b-empty-result
                v-else-if="!eventCalendarStore.isLoading && !eventCalendar.length"
                title="Нет событий"
            />

            <prime-data-table
                v-else
                :value="eventCalendar"
                :rows="eventCalendarStore.pagination.perPage"
                :total-records="eventCalendarStore.pagination.total"
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
                    header="Дата начала"
                    field="start_at"
                    class="table-start-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.start_at" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата окончания"
                    field="end_at"
                    class="table-end-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.end_at" />
                    </template>
                </prime-column>

                <prime-column
                    v-if="authStore.isSysAdmin"
                    header="Автор"
                    field="user"
                    class="table-user"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.user?.name" />
                    </template>
                </prime-column>

                <prime-column
                    header="Отдел"
                    field="department"
                    class="table-department"
                >
                    <template #body="{ data }">
                        <b-table-text :text="departmentName(data?.department?.id)" />
                    </template>
                </prime-column>

                <prime-column
                    header="Дата создания"
                    field="created_at"
                    class="table-created-at"
                >
                    <template #body="{ data }">
                        <b-table-text :text="formatStringToLocal(data?.created_at)" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.event-calendar-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table {
            &-title {
                @include col-fixed(300px);
            }
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
