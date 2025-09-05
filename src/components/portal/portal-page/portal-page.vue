<script setup lang="ts">
import { computed } from "vue"
import BTitle from "@c/common/b-title/b-title.vue"
import type { PortalPage } from "@c/portal/portal-page/definitions/portal-page"
import BImage from "@c/common/b-image/b-image.vue"

const props = defineProps<PortalPage>()

const rightImageSrc = computed(() => {
    if (props.rightImage) return props.rightImage
    return "logos/logo-large.png"
})
</script>

<template>
    <div class="portal-page">
        <b-title
            :title="props.title"
            variant="xl"
            class="mb-x2"
        />

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

<style scoped lang="scss">
.portal-page {

}
</style>
