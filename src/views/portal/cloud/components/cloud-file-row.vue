<script setup lang="ts">
import { ref } from "vue"
import type { CloudFileItem } from "@v/portal/cloud/definitions/cloud"
import * as cloudAPI from "@/api/modules/cloud/cloud"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import { downloadExternalFile } from "@/lib/files"
import BSpinner from "@c/common/b-spinner/b-spinner.vue"

const notify = useNotify()

const isLoading = ref(false)

const props = defineProps<{
    item: CloudFileItem
}>()

async function onClick() {
    console.log(isLoading.value)
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
                {{ props.item.title }}
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
        }

        .name {
            display: flex;
            align-items: center;
            position: relative;
        }

        &:hover {
            .name {
                font-weight: 600;
            }

            .icon {
                color: var(--p-surface-950);
            }
        }

        @include file-colors;
    }
}
</style>

