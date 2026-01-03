<script setup lang="ts">
import { computed } from "vue"
import BImage from "@c/common/b-image/b-image.vue"
import type { CloudFolderItem } from "@v/portal/cloud/definitions/cloud"
import { useRoutePath } from "@/composables/route/use-route-path"

const props = defineProps<{
    item: CloudFolderItem
}>()

const images: Record<string, string> = {
    docs:                "template/cloud-document.png",
    makets:              "template/cloud-image.png",
    video:               "template/cloud-video.png",
    digests:             "template/cloud-document.png",
    "video-instruction": "template/cloud-video.png",
}

const imageSrc = computed(() => images[props.item.slug] ?? images.docs)

const routePath = useRoutePath()

function onClick() {
    routePath.pushMergeMath(props.item.slug)
}
</script>

<template>
    <div
        class="cloud-catalog"
        @click="onClick"
    >
        <div class="container">
            <div class="image">
                <b-image
                    :src="imageSrc"
                    width="246px"
                />
            </div>
            <div class="title"> {{ props.item.name }} </div>
        </div>
        <div class="shadow" />
    </div>
</template>

<style scoped lang="scss">
.cloud-catalog {
    @include box-shadow;

    position: relative;
    min-width: 406px;
    min-height: calc(279px + 30px);
    display: flex;
    align-items: self-end;

    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        min-height: 279px;
        width: 100%;
        border-radius: $indent-x4;
        border: 1px solid var(--p-surface-600);
        z-index: 2;
        background: var(--p-surface-950);

        .image {
            position: relative;

            :deep(.b-image) {
                position: absolute;
                top: -60px;
                right: -40px;
                z-index: 1;
            }
        }

        .title {
            @include h2;

            padding: 0 0 $indent-x3 $indent-x4;
        }
    }

    //.shadow {
    //    @include box-shadow;
    //    @include box-shadow-position;
    //}
    //
    //&:hover .shadow {
    //    @include box-shadow-hover;
    //}
    //
    //&:hover .title {
    //    color: var(--p-primary-500);
    //}
}
</style>
