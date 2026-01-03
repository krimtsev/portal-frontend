<script setup lang="ts" >
import { useRouter } from "vue-router"
import BImage from "@c/common/b-image/b-image.vue"
import { openExternalLink } from "@/lib/link"
import { PortalRouteName } from "@r/portal/route-names"
import BButtonIcon from "@c/common/b-button-icon/b-button-icon.vue"

interface Route {
    name: PortalRouteName
    params?: Record<string, any>
    query?: Record<string, any>
}

const props = defineProps<{
    title?: string,
    path?: string | Route
    menuTitle?: boolean
    background?: {
        height: string
        src: string
    }
    pathPositionLeft?: boolean
    classTitle?: string | string[]
    classContent?: string | string[]
    mobileWrapForm?: boolean
}>()

const router = useRouter()
const onClick = () => {
    if (!props.path) return

    if (typeof props.path === "string") {
        if (props.path?.startsWith("http")) {
            openExternalLink(props.path)
            return
        }

        router.push({ path: props.path })
    }

    router.push(props.path)
}
</script>

<template>
    <div
        class="portal-card"
        :class="{
            'menu-title': menuTitle,
            'mobile-wrap-form': props.mobileWrapForm
        }"
    >
        <div
            v-if="props.title"
            class="card-title title-lg"
            :class="classTitle"
        >
            {{ props.title }}
        </div>
        <div
            class="card-content"
            :class="classContent"
        >
            <slot />
        </div>
        <div
            v-if="props.path"
            class="card-footer"
            :class="{ 'left': props.pathPositionLeft }"
        >
            <b-button-icon
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
    @include portal-card();

    flex-direction: column;
    flex-grow: 1;

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

            &.left {
                justify-content: flex-start;
                padding-left: $indent-x2;
            }
        }
    }

    &.menu-title {
        .card-title {
            padding-left: $indent-x2;
            margin-bottom: $indent-x5;
        }
    }

    :deep(.b-button-icon) {
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

        :deep(.b-image) {
            position: inherit;

            img {
                position: absolute;
                margin-left: auto;
                margin-right: auto;
                left: 0;
                right: 0;
                bottom: 0;
            }
        }
    }

    &.mobile-wrap-form {
        :deep(.portal-form-item) {
            @media (max-width: $layout-mobile-width) {
                flex-wrap: wrap;

                .portal-form-item-content {
                    margin-top: $indent-x1;
                }
            }
        }
    }

}
</style>
