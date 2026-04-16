<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"
import BTitle from "@c/common/b-title/b-title.vue"
import type { PortalPage } from "@c/portal/portal-page/definitions/portal-page"
import BImage from "@c/common/b-image/b-image.vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
import BButton from "@c/common/b-button/b-button.vue"
import BSpinnerWide from "@c/common/b-spinner/b-spinner-wide.vue"

const emit = defineEmits<{
    (e: "save"): void
    (e: "cancel"): void
}>()

const props = defineProps<PortalPage>()

const instance = getCurrentInstance()

const rightImageSrc = computed(() => {
    if (props.rightImage) return props.rightImage
    return "logos/logo-large.png"
})

const hasSaveAction = computed(() => {
    return typeof instance?.vnode.props?.onSave === "function"
})

const hasCancelAction = computed(() => {
    return typeof instance?.vnode.props?.onCancel === "function"
})

const isLoadingTitle = computed(() => {
    return props.isLoadingTitle || props.isLoading
})

const isLoadingContent = computed(() => {
    return props.isLoadingContent || props.isLoading
})

</script>

<template>
    <div
        class="portal-page"
        v-glow="{ position: 'top-left' }"
    >
        <div class="title mb-x2">
            <b-skeleton
                :is-loading="isLoadingTitle"
                variant="xl"
            >
                <b-title
                    :title="props.title"
                    variant="xl"
                />
            </b-skeleton>
        </div>

        <slot name="top-side" />

        <div class="grid">
            <div class="col-8 desktop-col-8 tablet-col-12 mobile-col-12">
                <div
                    v-if="isLoadingContent"
                    class="content flex-center"
                >
                    <b-spinner-wide />
                </div>

                <template v-else>
                    <slot />
                </template>

                <div
                    v-if="hasSaveAction || hasCancelAction"
                    class="footer mt-x2"
                >
                    <b-button
                        v-if="hasSaveAction"
                        label="Сохранить"
                        :disabled="props.isSubmitting"
                        @click="emit('save')"
                    />

                    <b-button
                        v-if="hasCancelAction"
                        label="Отменить"
                        :disabled="props.isSubmitting"
                        variant="secondary"
                        @click="emit('cancel')"
                    />
                </div>
            </div>

            <div class="col-4 tablet-hidden">
                <div class="flex-center">
                    <template v-if="!$slots['right-side']">
                        <b-image :src="rightImageSrc" />
                    </template>

                    <slot name="right-side" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.portal-page {
    .title > div {
        @include text-limit-rows;
    }

    .content {
        min-height: 400px;
    }

    .footer {
        @include portal-card();

        padding: $indent-x2;
        flex-direction: row;
        gap: $indent-x2;
    }
}
</style>
