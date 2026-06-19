<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps<{
    title?:       string
    description?: string
    widthBorder?: boolean
}>()

const { t } = useI18n()

const title = computed(() => {
    return props.title || t("mc.search.title")
})
</script>

<template>
    <div
        class="b-empty-result"
        :class="{
            'border': widthBorder
        }"
    >
        <div class="image-container">
            <i
                class="pi pi-times-circle"
                style="font-size: 3rem"
            />
        </div>

        <div class="text-container">
            <div class="title">
                {{ title }}
            </div>

            <div
                v-if="description"
                class="description"
            >
                {{ description }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-empty-result {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    min-height: 296px;
    padding: $indent-x3 $indent-x2;
    gap: $indent-x2;

    &.border {
        border: 1px solid var(--p-divider-border-color);
        border-radius: $indent-x2;
    }

    .image-container {
        color: var(--p-surface-300);
    }

    .text-container {
        @include flex-center;

        flex-direction: column;
        overflow-wrap: break-word;

        .title {
            font-size: 1.5rem;
            color: var(--p-surface-300);
        }

        .description {
            margin-top: $indent-x1;
        }
    }
}
</style>
