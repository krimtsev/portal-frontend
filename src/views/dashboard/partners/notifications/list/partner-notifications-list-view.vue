<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import PrimeColumn from "primevue/column"
import PrimeDataTable from "primevue/datatable"
import { usePartnerNotificationsStore } from "@s/dashboard/partners/partner-notifications"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouteNavigator } from "@/composables/route/use-route-navigator"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { HttpError } from "@/api"
import * as partnerNotificationsAPI from "@/api/modules/dashboard/partners/partner-notifications"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BSelect from "@c/common/b-select/b-select.vue"
import BTableText from "@c/common/b-table/b-table-text.vue"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import PartnerStateTag from "@v/dashboard/partners/company/list/components/partner-state-tag.vue"
import { partnerStateOptions } from "@v/dashboard/partners/company/list/utils/partners"
import PartnerNotificationStateTag
    from "@v/dashboard/partners/notifications/list/components/partner-notification-state-tag.vue"
import type { PartnerNotificationsListItem } from "@v/dashboard/partners/notifications/list/definitions/partner-notifications"
import { receiveMessagesStateOptions } from "@v/dashboard/partners/notifications/list/utils/partner-notifications"
import {
    boolToStatus,
    disabledToStatus,
    statusToBool,
    statusToDisabled,
} from "@/lib/status"
import { Status } from "@/definitions/status"
import router from "@/router"


const notify = useNotify()
const { t, n } = useI18n()
const { navigate } = useRouteNavigator()

const partnerNotificationsStore = usePartnerNotificationsStore()

const partnerNotifications = ref<PartnerNotificationsListItem[]>([])

const paginationInfo = computed(() => {
    return t("mc.pagination.table",
        {
            from:  n(partnerNotificationsStore.pagination.from),
            to:    n(partnerNotificationsStore.pagination.to),
            total: n(partnerNotificationsStore.pagination.total),
        },
        Number(partnerNotificationsStore.pagination.total),
    )
})

const firstPage = computed(() => {
    return (partnerNotificationsStore.filter.page - 1) * partnerNotificationsStore.pagination.perPage
})

const showPaginator = computed(() => {
    return !!partnerNotifications.value.length && partnerNotificationsStore.isShowPagination
})

function onPageChange({ page }: { page: number }) {
    if (partnerNotificationsStore.isLoading) return

    partnerNotificationsStore.setPage(page + 1)
    refreshPartnerNotifications()
}

onMounted(async () => {
    partnerNotificationsStore.setIsLoading(true)

    const [
        partnerNotificationData,
    ] = await Promise.all([
        partnerNotificationsAPI.list(partnerNotificationsStore.filter),
    ])

    if (partnerNotificationData instanceof HttpError) {
        notify.error()
        return
    }

    partnerNotifications.value = partnerNotificationData.list

    partnerNotificationsStore.setPagination(partnerNotificationData.page)
    partnerNotificationsStore.setIsLoading(false)
})

async function refreshPartnerNotifications() {
    partnerNotificationsStore.setIsLoading(true)

    const partnersData = await partnerNotificationsAPI.list(partnerNotificationsStore.filter)

    if (partnersData instanceof HttpError) {
        notify.error()
        partnerNotificationsStore.setIsLoading(false)
        return
    }

    partnerNotifications.value = partnersData.list
    partnerNotificationsStore.setPagination(partnersData.page)
    partnerNotificationsStore.setIsLoading(false)
}

function onChangeFilter() {
    if (!partnerNotificationsStore.isChanged) return

    partnerNotificationsStore.resetPage()
    partnerNotificationsStore.commitFilter()

    refreshPartnerNotifications()
}

const onClick = (id: string, event: MouseEvent) => {
    navigate(
        {
            name:   DashboardRouteName.DashboardPartnerNotification,
            params: { id },
        },
        event,
    )
}

const partnerState = computed({
    get() {
        return disabledToStatus(partnerNotificationsStore.filter.filters.disabled)
    },
    set(newValue: Status) {
        partnerNotificationsStore.filter.filters.disabled = statusToDisabled(newValue)
    },
})

const receiveMessagesState = computed({
    get() {
        return boolToStatus(partnerNotificationsStore.filter.filters.receive_messages)
    },
    set(newValue: Status) {
        partnerNotificationsStore.filter.filters.receive_messages = statusToBool(newValue)
    },
})

async function goToCreateMessage() {
    await router.push({ name: DashboardRouteName.DashboardPartnerMessage })
}
</script>

<template>
    <div class="partner-notifications-list-view">
        <b-toolbar
            no-paddings
            :show-more="!partnerNotificationsStore.isLoading"
        >
            <b-toolbar-item header="Статус филиала">
                <b-select
                    v-model="partnerState"
                    :options="partnerStateOptions"
                    :disabled="partnerNotificationsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    show-clear
                    placeholder="Выберите статус"
                    class="filter-state"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>

            <b-toolbar-item header="Уведопления">
                <b-select
                    v-model="receiveMessagesState"
                    :options="receiveMessagesStateOptions"
                    :disabled="partnerNotificationsStore.isLoading"
                    option-label="name"
                    option-value="id"
                    show-clear
                    placeholder="Выберите статус"
                    class="filter-state"
                    @change="onChangeFilter"
                />
            </b-toolbar-item>

            <template #more>
                <b-toolbar-item>
                    <b-button-secondary
                        label="Сообщение"
                        @click="goToCreateMessage"
                    />
                </b-toolbar-item>
            </template>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="partnerNotificationsStore.filter.search"
                        :disabled="partnerNotificationsStore.isLoading"
                        placeholder="Найти филиал"
                        class="search"
                        @change="onChangeFilter"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="partnerNotificationsStore.isLoading" />

            <b-empty-result
                v-else-if="!partnerNotificationsStore.isLoading && !partnerNotifications.length"
                title="Группы отсутствуют"
            />

            <prime-data-table
                v-else
                :value="partnerNotifications"
                :rows="partnerNotificationsStore.pagination.perPage"
                :total-records="partnerNotificationsStore.pagination.total"
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
                    field="title"
                    class="table-title link-text"
                >
                    <template #body="{ data }">
                        <b-table-text
                            :text="data?.name"
                            @click="(e: MouseEvent) => onClick(data?.id, e)"
                        />
                    </template>
                </prime-column>

                <prime-column
                    header="Новые"
                    field="new_clients_days"
                    class="table-new-clients-days"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.report_settings?.new_clients_days" />
                    </template>
                </prime-column>

                <prime-column
                    header="Повторные"
                    field="returned_clients_days"
                    class="table-returned-clients-days"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.report_settings?.returned_clients_days" />
                    </template>
                </prime-column>

                <prime-column
                    header="Потерянные"
                    field="lost_clients_days"
                    class="table-lost-clients-days"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.report_settings?.lost_clients_days" />
                    </template>
                </prime-column>

                <prime-column
                    field="send_missed_calls"
                    class="table-send-missed-calls"
                >
                    <template #header>
                        <b-table-text text="Потерянные звонки" />
                    </template>

                    <template #body="{ data }">
                        <partner-state-tag :active="data?.report_settings?.send_missed_calls" />
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
                    header="Telegram"
                    field="telegram_chat_id"
                    class="table-telegram-chat-id"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.notification_channel?.telegram_chat_id" />
                    </template>
                </prime-column>

                <prime-column
                    header="Уведопления"
                    field="is_active_now"
                    class="table-is-active-now"
                >
                    <template #body="{ data }">
                        <partner-notification-state-tag :active="data?.notification_channel.is_active_now" />
                    </template>
                </prime-column>

                <prime-column
                    field="status"
                    class="table-status"
                >
                    <template #header>
                        <b-table-text text="Статус филиала" />
                    </template>

                    <template #body="{ data }">
                        <partner-state-tag :active="!data?.status" />
                    </template>
                </prime-column>

                <prime-column
                    header="Оплачено"
                    field="payment_date"
                    class="table-payment-date"
                >
                    <template #body="{ data }">
                        <b-table-text :text="data?.notification_channel.check_payment
                            ? data?.notification_channel?.payment_date
                            : ''"
                        />
                    </template>
                </prime-column>
            </prime-data-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.partner-notifications-list-view {
    @include list-view;

    padding-top: $indent-x2;

    .table-wrapper {
        margin-top: $indent-x2;
    }

    :deep(.p-datatable) {
        @include table;

        .table {
            &-payment-date {
                @include col-fixed(120px);
            }

            &-new-clients-days,
            &-returned-clients-days,
            &-lost-clients-days {
                @include col-fixed(110px);
            }

            &-send-missed-calls {
                @include col-fixed(120px);
            }
        }
    }
}
</style>
