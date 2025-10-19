<script setup lang="ts">
import { useI18n } from "vue-i18n"
import BLink from "@c/common/b-link/b-link.vue"

const emit = defineEmits(["input"])

const { t } = useI18n()

const props = defineProps<{
    search?: string
    widthBorder?: boolean
}>()

</script>

<template>
    <div
        class="b-empty-search"
        :class="{
            'border': widthBorder
        }"
    >
        <div class="image-container">
            <i class="pi pi-search" style="font-size: 2rem"></i>
        </div>
        <div class="text-container">
            <div class="title">
                {{ t("mc.search.title") }}
            </div>

            <div class="description">
                {{ t("mc.search.notFound", { search: props.search }) }}
            </div>

            <b-link
                :label="t('mc.search.reset')"
                @click="emit('input', '')"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.b-empty-search {
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

    .text-container {
        @include flex-center;

        gap: $indent-x2;

        .title {
            @include h3();

            color: var(--p-surface-300);
        }

        .description {
            @include p();

            color: var(--p-surface-400);
        }

        flex-direction: column;
        overflow-wrap: break-word;
    }
}
</style>
