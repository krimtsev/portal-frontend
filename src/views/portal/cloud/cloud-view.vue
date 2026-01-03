<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import BInputSearch from "@c/common/b-input-search/b-input-search.vue"
import * as cloudAPI from "@/api/modules/cloud/cloud"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import type {
    CloudFileItem,
    CloudFolderBreadcrumb,
    CloudFolderItem
} from "@v/portal/cloud/definitions/cloud"
import CloudFolderRow from "@v/portal/cloud/components/cloud-folder-row.vue"
import CloudFolderRowSkeleton from "@v/portal/cloud/components/skeleton/cloud-folder-row-skeleton.vue"
import CloudFileRow from "@v/portal/cloud/components/cloud-file-row.vue"
import CloudFileRowSkeleton from "@v/portal/cloud/components/skeleton/cloud-file-row-skeleton.vue"
import CloudCatalog from "@v/portal/cloud/components/cloud-catalog.vue"
import CloudCatalogSkeleton from "@v/portal/cloud/components/skeleton/cloud-catalog-skeleton.vue"
import BBreadcrumb from "@c/common/b-breadcrumb/b-breadcrumb.vue"
import BBreadcrumbSkeleton from "@c/common/b-breadcrumb/b-breadcrumb-skeleton.vue"
import BEmptyResult from "@c/common/b-empty/b-empty-result.vue"
import { normalizeBreadcrumbs } from "@v/portal/cloud/utils/cloud"
import { useRoutePath } from "@/composables/route/use-route-path"
import BEmptySearch from "@c/common/b-empty/b-empty-search.vue"


const notify = useNotify()
const routePath = useRoutePath()

const folders = ref<CloudFolderItem[]>([])
const breadcrumbs = ref<CloudFolderBreadcrumb[]>([])
const files = ref<CloudFileItem[]>([])

const search = ref<string>("")
const searchPattern = /^.{3,}$/
const isLoading = ref(true)

const onSearchChange = (value: string) => {
    search.value = value
}

const slug = computed(() => {
    return routePath.getLastMatch()
})

onMounted(() => {
    getData()
})

watch([slug, search], () => {
    getData()
})

async function getData() {
    isLoading.value = true

    const params = {
        slug: slug.value,
        search: search.value
    }

    const data = await cloudAPI.getData(params)

    if (data instanceof HttpError) {
        notify.error()
        return false
    }

    breadcrumbs.value = normalizeBreadcrumbs(data.breadcrumbs)
    folders.value = data.folders
    files.value = data.files
    isLoading.value = false
}

const title = computed(() => {
    if (!breadcrumbs.value.length) {
        return "Облако файлов"
    }
    return breadcrumbs.value[breadcrumbs.value.length - 1].label
})

const home = ref({
    label: "Облако файлов",
    route: "/",
})

const onNavigate = (item: CloudFolderBreadcrumb) => {
    if (item.route) {
        onSearchChange("")
        routePath.pushMath(item.route)
    }
}

const isEmptyResult = computed(() => {
    return !folders.value.length && !files.value.length
})
</script>

<template>
    <portal-page
        :title="title"
        :is-loading-title="isLoading"
        class="cloud-view mb-x4"
        right-image="template/cloud.png"
    >
        <div class="content">
            <template v-if="slug">
                <div class="breadcrumb mb-x1">
                    <template v-if="isLoading">
                        <b-breadcrumb-skeleton class="pl-x0" />
                    </template>

                    <b-breadcrumb
                        v-else
                        :home="home"
                        :model="breadcrumbs"
                        class="pl-x0"
                    >
                        <template #item="{ item, props }">
                            <span v-if="!item.route">{{ item.label }}</span>

                            <a
                                v-else
                                href="#"
                                v-bind="props.action"
                                @click.prevent="onNavigate(item)"
                            >
                                <span>{{ item.label }}</span>
                            </a>
                        </template>
                    </b-breadcrumb>
                </div>

                <b-input-search
                    :model-value="search"
                    :pattern="searchPattern"
                    :disabled="isLoading"
                    placeholder="Поиск файлов во вложенной категории"
                    name="search"
                    class="mb-x4 search"
                    @change="onSearchChange"
                />
            </template>

            <b-empty-search
                v-if="!isLoading && search.length && isEmptyResult"
                :search="search"
                width-border
                @input="onSearchChange"
            />

            <b-empty-result
                v-else-if="!isLoading && isEmptyResult"
                width-border
            />

            <template v-else-if="!slug">
                <div class="catalog">
                    <template v-if="isLoading">
                        <cloud-catalog-skeleton v-for="i in 5" :key="i" />
                    </template>

                    <template v-else-if="folders.length">
                        <cloud-catalog
                            v-for="folder in folders"
                            :key="folder.id"
                            :item="folder"
                        />
                    </template>
                </div>
            </template>

            <template v-else>
                <div
                    v-if="isLoading || folders.length"
                    class="folders"
                    :class="{
                        'mb-x4': isLoading || folders.length
                    }"
                >
                    <p class="title">Папки</p>

                    <template v-if="isLoading">
                        <cloud-folder-row-skeleton v-for="i in 3" :key="i" />
                    </template>

                    <template v-else-if="folders.length">
                        <cloud-folder-row
                            v-for="folder in folders"
                            :key="folder.id"
                            :item="folder"
                        />
                    </template>
                </div>

                <div
                    v-if="isLoading || files.length"
                    class="files"
                >
                    <p class="title">Файлы</p>

                    <template v-if="isLoading">
                        <cloud-file-row-skeleton v-for="i in 4" :key="i" />
                    </template>

                    <template v-else-if="files.length">
                        <cloud-file-row
                            v-for="file in files"
                            :key="file.id"
                            :item="file"
                        />
                    </template>
                </div>
            </template>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.cloud-view {
    .search {
        max-width: 600px;
    }

    .title {
        color: var(--p-surface-500);
    }

    .folders {
        display: flex;
        flex-direction: column;
        gap: $indent-x1;

        .title {
            margin-bottom: $indent-x2;
        }
    }

    .files {
        display: flex;
        flex-direction: column;
        gap: #{$indent-x2 - 4};

        .title {
            margin-bottom: $indent-x1;
        }
    }

    .catalog {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: $indent-x3;
        overflow: hidden;
        padding-bottom: $indent-x3;
    }
}
</style>
