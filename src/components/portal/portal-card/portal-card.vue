<script lang="ts" setup>
import { useRouter } from "vue-router"
import BIcon from "@c/common/b-icon/b-icon.vue"
import BImage from "@c/common/b-image/b-image.vue"
import { openExternalLink } from "@/lib/link"

const props = defineProps<{
    title?: string,
    path?: string
    menuTitle?: boolean
    background?: {
        height: string
        src: string
    }
}>()

const router = useRouter()
const onClick = () => {
    if (props.path?.startsWith("http")) {
        openExternalLink(props.path)
        return
    }
    router.push({ path: props.path })
}
</script>

<template>
    <div
        class="portal-card"
        :class="{ 'menu-title': menuTitle }"
    >
        <div
            v-if="props.title"
            class="card-title title-lg"
        >
            {{ props.title }}
        </div>
        <div class="card-content">
            <slot />
        </div>
        <div
            v-if="props.path"
            class="card-footer"
        >
            <b-icon
                icon="pi pi-angle-right"
                severity="contrast"
                variant="text"
                size="large"
                rounded
                @click="onClick"
            />
        </div>
        <div
            v-if="props.background"
            class="card-background"
        >
            <b-image
                :src="props.background.src"
                :height="props.background.height"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.portal-card {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: $indent-x4 ;
    background: var(--p-portal-card-background);
    border-radius: $indent-x4;
    overflow: hidden;

    .card {
        &-title {
            @include card-title(rgba(255, 255, 255, 0.9));

            margin-bottom: $indent-x2;
        }

        &-content {
            flex-grow: 1;
            overflow: hidden;
        }

        &-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: auto;
            z-index: 2;
        }
    }

    &.menu-title {
        .card-title {
            padding-left: $indent-x3;
            margin-bottom: $indent-x5;
        }
    }

    :deep(.b-icon) {
        .p-button {
            border-color: rgba(255, 255, 255, 0.16);
            width: 38px;
            height: 38px !important;

            .p-button-icon {
                color: white;
            }
        }
    }

    .card-background {
        z-index: 1;

        :deep(img) {
            position: absolute;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
}
</style>
