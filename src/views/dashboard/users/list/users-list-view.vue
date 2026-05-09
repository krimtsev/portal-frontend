<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { useUsersStore } from "@s/dashboard/users/users"
import { useNotify } from "@/composables/notify/use-notify"
import { useOpenRoute } from "@/composables/route/use-open-route"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import * as usersAPI from "@/api/modules/dashboard/users/users"
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
import StateIcon from "@c/state-icon/state-icon.vue"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"
import UserStateTag from "@v/dashboard/users/list/components/user-state-tag.vue"
import type { UsersListItem } from "@v/dashboard/users/list/definitions/users"
import {
    accessList,
    exportXLS,
    rolesList,
    stateList,
} from "@v/dashboard/users/list/utils/users"

const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { openRoute } = useOpenRoute()
const usersStore = useUsersStore()

const users = ref<UsersListItem[]>([])
const partners = ref<PartnerOptionItem[]>([])
const isExporting = ref(false)

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(usersStore.pagination.from),
            to:    n(usersStore.pagination.to),
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
        partnersData,
    ] = await Promise.all([
        usersAPI.list(usersStore.filter),
        partnersAPI.options(),
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

function onClick(id: string, event: MouseEvent) {
    openRoute(
        {
            name:   DashboardRouteName.DashboardUser,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardUser,
        params: { id: "!new" },
    })
}

async function onExportXLS() {
    isExporting.value = true

    try {
        const usersData = await usersAPI.exportData()

        if (usersData instanceof HttpError) {
            notify.error()
            return
        }

        await exportXLS(usersData)
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="users-list-view">
        <b-toolbar
            no-paddings
            :show-more="!usersStore.isLoading"
        >
            <b-toolbar-item header="Филиал">
                <b-multi-select
                    v-model="usersStore.filter.filters.partner_id"
                    :options="partners"
                    :selected-count="usersStore.filter.filters.partner_id.length"
                    :disabled="usersStore.isLoading"
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

            <b-toolbar-item header="Роль">
                <b-multi-select
                    v-model="usersStore.filter.filters.role"
                    :options="rolesList"
                    :selected-count="usersStore.filter.filters.role.length"
                    :disabled="usersStore.isLoading"
                    option-label="name"
                    option-value="id"
                    filter
                    show-clear
                    placeholder="Выберите роль"
                    class="filter-role"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Статус">
                <b-multi-select
                    v-model="usersStore.filter.filters.disabled"
                    :options="stateList"
                    :selected-count="usersStore.filter.filters.disabled.length"
                    :disabled="usersStore.isLoading"
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
                <b-toolbar-item header="Доступы">
                    <b-multi-select
                        v-model="usersStore.filter.filters.access"
                        :options="accessList"
                        :selected-count="usersStore.filter.filters.access.length"
                        :disabled="usersStore.isLoading"
                        option-label="name"
                        option-value="id"
                        filter
                        show-clear
                        placeholder="Выберите доступы"
                        class="filter-access"
                        @hide="onChangeFilter"
                        @clear="onChangeFilter"
                    />
                </b-toolbar-item>

                <b-toolbar-item empty-header>
                    <b-button-secondary
                        label="Добавить сотрудника"
                        :disabled="usersStore.isLoading"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-export
                        :types="{ xls: true }"
                        :disabled="{ xls: usersStore.isLoading || isExporting }"
                        :loading="{ xls: isExporting }"
                        @export-xls="onExportXLS"
                    />
                </b-toolbar-item>

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
            <list-loading-state v-if="usersStore.isLoading" />

            <b-empty-result
                v-else-if="!usersStore.isLoading && !users.length"
                title="Нет пользователей"
            />

            <prime-data-table
                v-else
                :value="users"
                :rows="usersStore.pagination.perPage"
                :total-records="usersStore.pagination.total"
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
                    header="Логин"
                    field="login"
                    class="table-login link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.login"
                            @click="(e: MouseEvent) => onClick(data?.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Филиал"
                    field="partner"
                    class="table-partner"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.partner?.name" />
                    </template>
                </prime-column>

                <prime-column
                    field="role"
                    header="Роль"
                    class="table-role"
                >
                    <template #body="{ data }">
                        <b-table-text :text="t(`mc.roles.${data?.role}`)" />
                    </template>
                </prime-column>

                <prime-column
                    field="location_map"
                    header="Карта"
                    class="table-location-map"
                >
                    <template #body="{ data }">
                        <state-icon :value="data?.access.location_map" />
                    </template>
                </prime-column>

                <prime-column
                    field="disabled"
                    header="Статус"
                    class="table-disabled"
                >
                    <template #body="{ data }">
                        <user-state-tag :active="!data?.disabled" />
                    </template>
                </prime-column>

                <prime-column
                    field="last_activity"
                    header="Активность"
                    class="table-last-activity"
                >
                    <template #body="{ data }">
                        <b-text-date :value="data?.last_activity" />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.users-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table {
            &-login {
                @include col-fixed(200px);
            }
        }
    }

    .filter {
        &-partner,
        &-role,
        &-state,
        &-access{
            @include col-width(250px);
        }
    }

    .search {
        @include col-width(210px);
    }
}
</style>
