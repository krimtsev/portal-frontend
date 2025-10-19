<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
    title?: string
    widthBorder?: boolean
}>()

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
            <i class="pi pi-times-circle" style="font-size: 2rem"></i>
        </div>
        <div class="text-container">
            <div class="title">
                {{ title }}
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

    .text-container {
        @include flex-center;

        flex-direction: column;
        overflow-wrap: break-word;
    }
}
</style>
