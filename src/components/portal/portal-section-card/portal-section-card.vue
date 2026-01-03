<script setup lang="ts">
import type { PortalSectionCardItem } from "@c/portal/portal-section-card/definitions/portal-section-card"
import BTitle from "@c/common/b-title/b-title.vue"
import BSvg from "@c/common/b-svg/b-svg.vue"

const props = defineProps<PortalSectionCardItem>()
</script>

<template>
    <div class="portal-section-card">
        <div class="container">
            <div class="icon">
                <b-svg :name="props.icon" />
            </div>
            <div class="text-content">
                <div class="title">
                    <b-title :title="props.title" />
                </div>
                <div
                    v-if="props.description"
                    class="description"
                >
                    {{ props.description }}
                </div>
            </div>
        </div>
        <div class="shadow" />
    </div>
</template>

<style lang="scss" scoped>
.portal-section-card {
    @include box-shadow();

    position: relative;
    flex: 1;

    .container {
        position: relative;
        display: flex;
        flex-grow: 1;
        cursor: pointer;
        width: 100%;
        min-height: 152px;
        height: 100%;
        border-radius: $indent-x4;
        border: 1px solid var(--p-surface-600);
        z-index: 2;
        background: var(--p-surface-950);
        padding: $indent-x3 $indent-x3 $indent-x3 0;

        .icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 64px;

            :deep(.b-svg) {
                @include h3();

                color: var(--p-surface-400);
            }
        }

        .description {
            @include p();

            margin-top: $indent-x2;
            color: var(--p-surface-400);
        }
    }
}
</style>
