<script setup lang="ts">
import BLink from "@c/common/b-link/b-link.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import type { Section } from "@c/portal/portal-information-menu/definitions/portal-information-menu"

const props = defineProps<{
    sections: Section[]
}>()
</script>

<template>
    <portal-card
        title="Информация"
        menu-title
        v-glow="{ position: 'top-left' }"
        class="portal-card"
    >
        <div class="portal-information-menu grid">
            <div
                v-for="(section, index) in props.sections"
                :key="index"
                class="col-12"
            >
                <div class="section-title">{{ section.title }}</div>
                <div
                    v-for="(item, index) in section.items"
                    :key="index"
                    class="section-item"
                >
                    <b-link
                        v-if="item.path"
                        :label="item.label"
                        :href="item.path"
                        as-internal
                    />

                    <b-link
                        v-else-if="item.external"
                        :label="item.label"
                        :href="item.external"
                    />

                    <span v-else>{{ item.label }}</span>
                </div>
            </div>
        </div>
    </portal-card>
</template>

<style scoped lang="scss">
.portal-card {
    background: var(--p-portal-menu-background);
    border: 1px solid var(--p-portal-menu-border-color);
}

.portal-information-menu {
    @media (min-width: $layout-mobile-width) {
        display: block;
        column-count: 3;
        column-gap: calc($indent-x1 * 8);

        > .col-12 {
            break-inside: avoid;
            -webkit-column-break-inside: avoid; // Safari
            page-break-inside: avoid;

            display: block;
            width: 100%;
            margin-bottom: $indent-x2;
            padding-left: $indent-x2;
        }
    }

    @media (max-width: $breakpoints-xl) {
        column-count: 2;
    }

    .section-title {
        @include title(var(--p-portal-menu-title-color));

        margin-bottom: $indent-x2;
    }

    .section-item {
        border-bottom: 1px solid var(--p-portal-menu-divider-color);
        padding: $indent-x1 $indent-x2;

        :deep() {
            display: block;
        }

        :deep(.b-link) {
            display: block;

            .button-link {
                @include text-overflow;

                color: var(--p-portal-menu-link-color);
                text-decoration: none;
                cursor: pointer;
                display: block;

                &:hover {
                    color: var(--p-portal-menu-link-hover-color);
                }

                &:focus {
                    color: var(--p-portal-menu-link-focus-color);
                }

                &:active {
                    color: var(--p-portal-menu-link-active-color);
                }
            }
        }
    }
}
</style>
