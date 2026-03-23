<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BTextDate from "@c/common/b-text/b-text-date.vue"
import BText from "@c/common/b-text/b-text.vue"
import BMultiSelect from "@c/common/b-select/b-multi-select.vue"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import PrimeDataTable from "primevue/datatable"
import PrimeColumn from "primevue/column"
import UserStateTag from "@v/dashboard/users/list/components/user-state-tag.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useUsersStore } from "@s/dashboard/users/users"
import type { UsersListItem } from "@v/dashboard/users/list/definitions/users.ts"
import * as usersAPI from "@/api/modules/dashboard/users/users"
import { HttpError } from "@/api"
import { DashboardRouteName } from "@r/dashboard/route-names"
import type { PartnerOptionItem } from "@v/dashboard/partners/list/definitions/partners"
import * as partnersAPI from "@/api/modules/dashboard/partners/partners"
import { rolesList, stateList } from "@v/dashboard/users/list/utils/users"
import { useOpenRoute } from "@/composables/route/use-open-route"


const notify = useNotify()
const { t, n } = useI18n()
const router = useRouter()
const { openRoute } = useOpenRoute()
const usersStore = useUsersStore()

const users = ref<UsersListItem[]>([])
const partners = ref<PartnerOptionItem[]>([])

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
        partnersAPI.options()
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

const onClick = (id: string, event: MouseEvent) => {
    openRoute(
        {
            name: DashboardRouteName.DashboardUser,
            params: { id }
        },
        event
    )
}

function goToNew() {
    router.push({
        name: DashboardRouteName.DashboardUser,
        params: { id: "!new" }
    })
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
                    class="partner"
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
                    class="role"
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
                    class="state"
                    @hide="onChangeFilter"
                    @clear="onChangeFilter"
                />
            </b-toolbar-item>

            <template #more>
                <b-toolbar-item>
                    <b-button-secondary
                        label="Добавить сотрудника"
                        @click="goToNew"
                    />
                </b-toolbar-item>
            </template>

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
                    field="login"
                    header="Логин"
                    class="table-login"
                >
                    <template #body="slotProps">
                        <b-text
                            :value="slotProps.data.login"
                            class="link-text"
                            @click="(e: MouseEvent) => onClick(slotProps.data.id, e)"
                        />
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
                        <user-state-tag :active="!slotProps.data.disabled" />
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
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.users-list-view {
    @include list-view;

    padding-top: $indent-x2;

    :deep(.p-datatable) {
        @include table;
    }

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
