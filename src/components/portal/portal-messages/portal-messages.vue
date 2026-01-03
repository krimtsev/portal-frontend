<script setup lang="ts">
import { computed } from "vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PrimeCarousel from "primevue/carousel"
import type { MessageItem } from "@/api/modules/messages/messages"
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"

const props = defineProps<{
    messages: MessageItem[]
    isLoading: boolean
}>()

const isSingleMessage = computed(() => {
    return props.messages.length == 1
})

const autoplayInterval = computed(() => {
    return props.messages.length > 1 ? 1000*30 : undefined
})
</script>

<template>
    <portal-card class="portal-messages">
        <prime-carousel
            :value="props.messages"
            :numVisible="1"
            :numScroll="1"
            :show-indicators="false"
            :show-navigators="!isSingleMessage"
            :autoplay-interval="autoplayInterval"
            :circular="!isSingleMessage"
            class="carousel"
        >
            <template #item="slotProps">
                <div class="carousel-item">
                    <div class="title">{{ slotProps.data.title }}</div>
                    <div class="description">{{ slotProps.data.description }}</div>
                </div>
            </template>

            <template #empty>
                <div class="carousel-item">
                    <template v-if="props.isLoading">
                        <div class="title">
                            <b-skeleton variant="sm" width="50%" invert />
                        </div>
                        <div class="description">
                            <b-skeleton width="75%" invert />
                        </div>
                    </template>

                    <template v-else>
                        <div class="title">
                            Важное сообщение
                        </div>
                        <div class="description">
                            На данный момент сообщений нет
                        </div>
                    </template>

                </div>
            </template>
        </prime-carousel>
    </portal-card>
</template>

<style scoped lang="scss">
.portal-messages {
    background: var(--p-primary-500);
    min-height: $portal-card-min-height;

    :deep(.p-carousel) {
        height: 100%;

        .p-carousel-content-container,
        .p-carousel-content,
        .p-carousel-items-content,
        .p-carousel-viewport,
        .p-carousel-item-list,
        .p-carousel-item,
        .carousel-item {
            height: 100%;
        }

        .carousel-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: $indent-x2;

            .title {
                @include card-title(var(--p-surface-950));

                margin-bottom: $indent-x2;
            }

            .description {
                color: var(--p-surface-950);
            }
        }

        .p-carousel-prev-button {
            display: none !important;
        }

        .p-button-text {
            align-self: flex-end;
        }
    }
}
</style>
