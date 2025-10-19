<script setup lang="ts">
import { computed } from "vue"
import BTitle from "@c/common/b-title/b-title.vue"
import type { PortalPage } from "@c/portal/portal-page/definitions/portal-page"
import BImage from "@c/common/b-image/b-image.vue"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"

const props = defineProps<PortalPage>()

const rightImageSrc = computed(() => {
    if (props.rightImage) return props.rightImage
    return "logos/logo-large.png"
})
</script>

<template>
    <div class="portal-page">
        <div class="title mb-x2">
            <div v-if="props.isLoading">
                <b-skeleton variant="xl" />
            </div>

            <b-title
                v-else
                :title="props.title"
                variant="xl"
            />
        </div>

        <slot name="top-side" />

        <div class="grid">
            <div class="col-8 mob-col-12">
                <slot />
            </div>

            <div class="col-4 mob-hidden">
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
