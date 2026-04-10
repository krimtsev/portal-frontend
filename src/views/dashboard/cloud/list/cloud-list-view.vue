<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import PrimeTreeTable from "primevue/treetable"
import BToolbar from "@c/common/b-toolbar/b-toolbar.vue"
import BToolbarItem from "@c/common/b-toolbar/b-toolbar-item.vue"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import ListLoadingState from "@c/common/b-loading-state/list-loading-state.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import { useNotify } from "@/composables/notify/use-notify"
import { useRouter } from "vue-router"
import { useOpenRoute } from "@/composables/route/use-open-route"
import { useCloudListStore } from "@s/dashboard/cloud/cloud-list.ts"
import { DashboardRouteName } from "@r/dashboard/route-names"
import { PortalRouteName } from "@r/portal/route-names"
import { type CloudListItem, CloudType } from "@v/dashboard/cloud/list/definitions/cloud-list"
import PrimeColumn from "primevue/column"
import BText from "@c/common/b-text/b-text.vue"
import { HttpError } from "@/api"
import * as cloudAPI from "@/api/modules/dashboard/cloud/cloud"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"


const notify = useNotify()
const router = useRouter()
const { openRoute } = useOpenRoute()
const cloudListStore = useCloudListStore()

const cloudList = ref<CloudListItem[]>([])

onMounted(async () => {
    cloudListStore.setIsLoading(true)

    const [
        cloudListData,
    ] = await Promise.all([
        cloudAPI.tree(cloudListStore.filter),
    ])

    if (cloudListData instanceof HttpError) {
        notify.error()
        return
    }

    cloudList.value = cloudListData.list

    cloudListStore.setIsLoading(false)
})

const onClick = (id: string, event: MouseEvent) => {
    openRoute(
        {
            name:   DashboardRouteName.DashboardCloud,
            params: { id },
        },
        event,
    )
}

function goToNew() {
    router.push({
        name:   DashboardRouteName.DashboardCloud,
        params: { id: "!new" },
    })
}

function goToPortal(path: string[]) {
    router.push({
        name:   PortalRouteName.Cloud,
        params: { pathMatch: path },
    })
}

const filters = computed(() => {
    return {
        name: cloudListStore.filter.search,
    }
})
</script>

<template>
    <div class="cloud-list-view">
        <b-toolbar no-paddings>
            <b-toolbar-item>
                <b-button-secondary
                    label="Добавить каталог"
                    :disabled="cloudListStore.isLoading"
                    @click="goToNew"
                />
            </b-toolbar-item>

            <template #right-side>
                <b-toolbar-item>
                    <b-input-search
                        v-model="cloudListStore.filter.search"
                        :disabled="cloudListStore.isLoading"
                        placeholder="Найти файл"
                        class="search"
                    />
                </b-toolbar-item>
            </template>
        </b-toolbar>

        <div class="table-wrapper">
            <list-loading-state v-if="cloudListStore.isLoading" />

            <b-empty-result
                v-else-if="!cloudListStore.isLoading && !cloudList.length"
                title="Файлы отсутствуют"
            />

            <prime-tree-table
                v-else
                :value="cloudList"
                :filters="filters"
                filter-mode="lenient"
                class="table show-empty"
            >
                <template #empty>
                    <b-empty-result title="Файлы отсутствуют" />
                </template>

                <prime-column
                    field="name"
                    header="Название"
                    class="table-name"
                    expander
                >
                    <template #body="slotProps">
                        <b-text
                            v-if="slotProps.node?.data.type === CloudType.Folder"
                            :value="slotProps.node?.data.name"
                            class="link-text"
                            @click="(e: MouseEvent) => onClick(slotProps.node?.data.id, e)"
                        />
                        <b-text
                            v-else
                            :value="slotProps.node?.data.name"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="ext"
                    header="Тип"
                    class="table-ext"
                >
                    <template #body="slotProps">
                        <b-text
                            v-if="slotProps.node?.data.type === CloudType.File"
                            :value="slotProps.node?.data.ext"
                            :class="['ext', slotProps.node?.data.ext?.toLowerCase()]"
                        />

                        <span
                            v-else
                            class="pi pi-folder-open"
                        />
                    </template>
                </prime-column>

                <prime-column
                    field="downloads"
                    header="Скачано"
                    class="table-downloads"
                >
                    <template #body="slotProps">
                        <b-text :value="slotProps.node?.data.downloads" />
                    </template>
                </prime-column>

                <prime-column />

                <prime-column
                    header="Портал"
                    class="table-actions"
                >
                    <template #body="slotProps">
                        <b-button-icon
                            v-if="slotProps.node?.data.slug"
                            icon="pi pi-external-link"
                            severity="contrast"
                            size="small"
                            @click="goToPortal(slotProps.node?.data.path)"
                        />
                    </template>
                </prime-column>
            </prime-tree-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cloud-list-view {
    @include list-view;

    padding-top: $indent-x2;

    :deep(.p-treetable) {
        @include table;

        .table-name {
            @include col-width(400px);
        }

        .table-downloads {
            @include col-width(150px);
        }

        .table-ext {
            @include col-width(150px);
            @include file-colors;
        }

        .table-actions {
            @include col-width(100px);
            @include table-column-align(flex-end);
        }
    }

    .table-wrapper {
        margin-top: $indent-x2;
    }
}
</style>
