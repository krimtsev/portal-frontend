<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import BText from "@c/common/b-text/b-text.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import PrimeDataTable, { type DataTableRowSelectEvent } from "primevue/datatable"
import PrimeMultiSelect from "primevue/multiselect"
import PrimeColumn from "primevue/column"
import UserState from "@v/dashboard/users/list/components/user-state.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useUsersStore } from "@s/dashboard/users/users"
import type { UsersListItem } from "@v/dashboard/users/list/definitions/users-list"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import { HttpError } from "@/api"
import { DashboardRouteName } from "@r/dashboard/route-names"
import type { PartnerShortListItem } from "@v/dashboard/partners/list/definitions/partners"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import { rolesList, statesList } from "@v/dashboard/users/list/utils/user-list"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const usersStore = useUsersStore()

const users = ref<UsersListItem[]>([])
const partners = ref<PartnerShortListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from: n(usersStore.pagination.from),
            to: n(usersStore.pagination.to),
            total: n(usersStore.pagination.total),
        },
        Number(usersStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (usersStore.filter.page - 1) * usersStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!users.value.length && usersStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (usersStore.isLoading) return

    usersStore.setPage(page + 1)
    refreshTickets()
}

onMounted(async () => {
    usersStore.setIsLoading(true)

    const [
        usersData,
        partnersData
    ] = await Promise.all([
        usersAPI.list(usersStore.filter),
        partnersAPI.shortList()
    ])

    if (
        usersData instanceof HttpError ||
        partnersData instanceof HttpError
    ) {
        notify.error()
        return
    }

    users.value = usersData.list
    partners.value = partnersData.list

    usersStore.setPagination(usersData.page)
    usersStore.setIsLoading(false)
})

async function refreshTickets() {
    usersStore.setIsLoading(true)

    const usersData = await usersAPI.list(usersStore.filter)

    if (usersData instanceof HttpError) {
        notify.error()
        usersStore.setIsLoading(false)
        return
    }

    users.value = usersData.list
    usersStore.setPagination(usersData.page)
    usersStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!usersStore.isChanged) return

    usersStore.resetPage()
    usersStore.commitFilter()

    refreshTickets()
}

const onRowClick = (event: DataTableRowSelectEvent) => {
    const mouseEvent = event.originalEvent as MouseEvent
    const { id } = event.data

    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
        const route = router.resolve({
            name:   DashboardRouteName.DashboardUser,
            params: { id }
        })

        window.open(route.href, "_blank")
        return
    }

    router.push({ name: DashboardRouteName.DashboardUser, params: { id } })
}
</script>

<template>
    <div class="users-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item header="Филиал">
                <prime-multi-select
                    v-model="usersStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-items-label="t('mc.select.elements', usersStore.filter.filters.partner_id.length)"
                    :max-selected-labels="1"
                    :disabled="usersStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите филиал"
                    class="partner"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Роль">
                <prime-multi-select
                    v-model="usersStore.filter.filters.role"
                    :options="rolesList"
                    :selected-items-label="t('mc.select.elements', usersStore.filter.filters.role.length)"
                    :max-selected-labels="1"
                    :disabled="usersStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите роль"
                    class="role"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Статус">
                <prime-multi-select
                    v-model="usersStore.filter.filters.disabled"
                    :options="statesList"
                    :selected-items-label="t('mc.select.elements', usersStore.filter.filters.disabled.length)"
                    :max-selected-labels="1"
                    :disabled="usersStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    placeholder="Выберите статус"
                    class="state"
                    @hide="onChangeFilter"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="usersStore.filter.search"
                        :disabled="usersStore.isLoading"
                        placeholder="Найти пользователя"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <prime-data-table
                :value="users"
                :rows="usersStore.pagination.perPage"
                :total-records="usersStore.pagination.total"
                :first="firstPage"
                :paginator="showPaginator"
                class="table"
                @page="onPageChange"
                @row-select="onRowClick"
                selection-mode="single"
                data-key="id"
                scrollable
                lazy
            >
                <template #paginatorstart>
                    {{ paginationInfo }}
                </template>

                <template v-if="usersStore.isLoading">
                    <list-loading-state />
                </template>

                <template v-else-if="!usersStore.isLoading && !users.length">
                    <b-empty-result title="Нет пользователей" />
                </template>

                <template v-else>
                    <prime-column
                        field="login"
                        header="Логин"
                        class="table-login"
                    >
                        <template #body="slotProps">
                            <b-text :value="slotProps.data.login" />
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
                        field="role"
                        header="Роль"
                        class="table-role"
                    >
                        <template #body="slotProps">
                            <b-text :value="t(`mc.roles.${slotProps.data.role}`)" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="disabled"
                        header="Статус"
                        class="table-disabled"
                    >
                        <template #body="slotProps">
                            <user-state :active="!slotProps.data.disabled" />
                        </template>
                    </prime-column>

                    <prime-column
                        field="last_activity"
                        header="Активность"
                        class="table-last-activity"
                    >
                        <template #body="slotProps">
                            <b-text-date :value="slotProps.data.last_activity" />
                        </template>
                    </prime-column>
                </template>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.users-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .partner,
    .role,
    .state {
        @include col-width(250px);
    }

    .search {
        @include col-width(210px);
    }

    .table-wrapper {
        margin-top: $indent-x2;
    }
}
</style>
