<script setup lang="ts">
import { computed } from "vue"
import BSvg from "@c/common/b-svg/b-svg.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import BSpinner from "@c/common/b-spinner/b-spinner.vue"
import PrimeButton from "primevue/button"
import BButtonSecondary from "@c/common/b-button/b-button-secondary.vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const emit = defineEmits(["save"])

const props = defineProps<{
    title: string
    isLoading?: boolean
    isFirstLoading?: boolean
    hideFooter?: boolean
    hideSaveButton?: boolean
    hideCancelButton?: boolean
    pathBack?: string
}>()

const route = useRoute()
const router = useRouter()

const defaultPathBack = computed((): string => {
    const pathArr = route.path.split("/")
    pathArr.pop()
    return pathArr.join("/")
})

const path = computed(() => {
    return props.pathBack || defaultPathBack.value
})

const goBack = () => {
    if (path.value) router.push(path.value)
}

const onSave = () => {
    emit("save")
}
</script>

<template>
    <div class="b-form">
        <div class="header">
            <div
                class="btn-back"
                @click="goBack"
            >
                <b-svg
                    name="pi-angle-left"
                    size="1.5rem"
                />
            </div>

            <b-title
                :title="props.title"
                variant="sm"
            />

        </div>

        <div
            class="main"
            :class="{ 'loading': props.isFirstLoading }"
        >
            <article
                v-if="props.isFirstLoading"
                class="main-loading"
            >
                <b-spinner />
            </article>

            <div class="main-content">
                <slot />
            </div>
        </div>

        <article
            v-if="!props.hideFooter && !props.isFirstLoading"
            class="footer"
        >
            <slot name="footer">
                <prime-button
                    v-if="!hideSaveButton"
                    :label="t('mc.common.save')"
                    :disabled="isLoading"
                    :loading="isLoading"
                    @click="onSave"
                />

                <b-button-secondary
                    v-if="!hideCancelButton"
                    :label="t('mc.common.cancel')"
                    :disabled="isLoading"
                    @click="goBack"
                />
            </slot>
        </article>
    </div>
</template>

<style scoped lang="scss">
.b-form {
    .header,
    .main,
    .footer {
        width: 100%;
    }

    .header {
        display: flex;
        justify-content: flex-start;
        position: relative;
        align-items: center;
        box-shadow: inset 0 -1px 0 0 var(--p-surface-600);
        background-color: var(--p-dashboard-card-background);
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;

        .btn-back {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 64px;
            height: 56px;

            :deep(.b-svg) {
                color: var(--p-surface-100);
            }

            &:hover {
                :deep(.b-svg) {
                    color: var(--p-button-primary-hover-background);
                }
            }

            &:active {
                :deep(.b-svg) {
                    color: var(--p-button-primary-active-background);
                }
            }
        }
    }
    .main{
        &.loading {
            @include flex-center;

            flex-direction: column;
            height: 256px;
            background-color: var(--p-dashboard-card-background);
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;

            .main-content {
                overflow: hidden;
                height: 0;
                opacity: 0;
                visibility: hidden;
                transform: scale(0);
            }
        }
    }

    :deep() {
        article {
            border-radius: $border-radius;
        }

        article + article {
            margin-top: $indent-x2;
        }

        article:first-of-type:not(.footer) {
            border-radius: 0 0 $border-radius $border-radius;
        }
    }

    .footer {
        display: flex;
        overflow: hidden;
        margin-top: $indent-x1;
        background-color: var(--p-dashboard-card-background);
        padding: $indent-x2;
        gap: $indent-x2;
    }
}
</style>
