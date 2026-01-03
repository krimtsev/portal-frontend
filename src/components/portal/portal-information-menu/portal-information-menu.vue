<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import { useRouter } from "vue-router"
import BLink from "@c/common/b-link/b-link.vue"
import type { Section } from "@c/portal/portal-information-menu/definitions/portal-information-menu"

const router = useRouter()

const props = defineProps<{
    sections: Section[],
}>()
</script>

<template>
    <portal-card
        title="Информация"
        menu-title
        v-glow="{ position: 'top-left' }"
    >
        <div class="portal-information-menu grid">
            <div class="col-12" v-for="(section, index) in props.sections" :key="index">
                <div class="section-title">{{ section.title }}</div>
                <div
                    v-for="(item, idx) in section.items"
                    :key="idx"
                    class="section-item"
                >
                    <template v-if="item.path">
                        <b-link
                            v-if="item.path"
                            :label="item.label"
                            @click="router.push({ path: item.path })"
                        />
                        <span v-else>{{ item.label }}</span>
                    </template>
                    <template v-else-if="item.external">
                        <b-link
                            v-if="item.external"
                            :label="item.label"
                            :href="item.external"
                            as-internal
                        />
                        <span v-else>{{ item.label }}</span>
                    </template>
                </div>
            </div>
        </div>
    </portal-card>
</template>

<style scoped lang="scss">
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

    @media (max-width: $layout-desktop-width) {
        column-count: 2;
    }

    .section-title {
        @include title(var(--p-surface-400));

        margin-bottom: $indent-x2;
    }

    .section-item {
        border-bottom: 1px solid var(--p-surface-600);
        padding: $indent-x1 $indent-x2;

        :deep(.button-link) {
            color: var(--p-surface-100);
            text-decoration: none;
            cursor: pointer;

            &:hover {
                color: var(--p-primary-700);
            }
        }
    }
}
</style>
