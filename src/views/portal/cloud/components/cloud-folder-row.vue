<script setup lang="ts">
import BSvg from "@c/common/b-svg/b-svg.vue"
import type { CloudFolderItem } from "@v/portal/cloud/definitions/cloud"
import { useRoutePath } from "@h/route/route"

const props = defineProps<{
    item: CloudFolderItem
}>()

const routePath = useRoutePath()

function onClick() {
    routePath.pushMergeMath(props.item.slug)
}
</script>

<template>
    <div class="cloud-folder-row">
        <div
            class="wrapper"
            @click="onClick"
        >
            <div class="icon">
                <b-svg name="folder" />
            </div>

            <div class="name">
                {{ props.item.name }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cloud-folder-row {
    display: flex;
    flex-direction: row;

    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $indent-x2;
        min-height: 35px;
        cursor: pointer;
        width: auto;

        &:hover {
            :deep(.b-svg) {
                color: var(--p-primary-500);
            }

            .name {
                font-weight: 600;
            }
        }
    }
}
</style>
