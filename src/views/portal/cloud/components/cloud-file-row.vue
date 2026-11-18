<script setup lang="ts">
import { computed, ref } from "vue"
import PrimeTag from "primevue/tag"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as cloudAPI from "@/api/modules/cloud/cloud"
import BSpinner from "@c/common/b-spinner/b-spinner.vue"
import type { CloudFileItem } from "@v/portal/cloud/definitions/cloud"
import { downloadExternalFile } from "@/lib/files"
import { formatBytes } from "@/lib/format-size"

const props = defineProps<{
    item: CloudFileItem
}>()

const notify = useNotify()

const isLoading = ref(false)

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000
const fileSize = computed(() => formatBytes(props.item.size))

const isNew = computed(() => {
    const date = new Date(props.item.date.replace(" ", "T"))
    const time = date.getTime()

    if (Number.isNaN(time)) return false

    const diff = Date.now() - time

    return diff >= 0 && diff <= FIVE_DAYS_MS
})

async function onClick() {
    if (isLoading.value) return

    isLoading.value = true

    try {
        const data = await cloudAPI.download(props.item.cloud_folders_id, props.item.name)

        if (data instanceof HttpError) {
            notify.error()
            return
        }

        const { title, ext } = props.item
        downloadExternalFile(data, `${title}.${ext}`)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div
        class="cloud-file-row"
        :class="{ 'disabled': isLoading }"
    >
        <div
            class="wrapper"
            @click="onClick"
        >
            <div
                class="icon"
                :class="props.item.ext"
            >
                <b-spinner v-if="isLoading" />

                <template v-else>
                    {{ props.item.ext }}
                </template>
            </div>

            <div class="name">
                <div class="title-row">
                    <span class="title">{{ props.item.title }}</span>

                    <prime-tag
                        v-if="isNew"
                        value="Новый"
                        severity="info"
                    />
                </div>

                <span
                    v-if="fileSize"
                    class="size"
                >
                    {{ fileSize }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cloud-file-row {
    display: flex;
    flex-direction: row;

    &.disabled {
        pointer-events: none;
        opacity: 0.7;

        .wrapper:hover {
            .name {
                font-weight: normal;
            }
            .icon {
                color: inherit;
            }
        }
    }

    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $indent-x2;
        min-height: 39px;
        cursor: pointer;
        width: auto;

        .icon {
            @include small-text;

            display: flex;
            align-items: center;
            justify-content: center;
            width: 39px;
            height: 39px;
            border-radius: 50%;
            border-width: 1px;
            border-style: solid;
            line-height: 39px;
            flex-shrink: 0;
            vertical-align: middle;
            background: var(--p-cloud-file-background);
        }

        .name {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;

            .title-row {
                display: flex;
                align-items: center;
                gap: $indent-x2;
            }

            .size {
                @include small-text;

                color: var(--p-text-muted-color);
            }
        }

        @include file-colors;
    }
}
</style>

