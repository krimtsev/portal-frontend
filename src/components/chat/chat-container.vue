<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

defineProps<{
    emptyMessages?: boolean
}>()

const containerRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
    if (containerRef.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
}

defineExpose({ scrollToBottom })
</script>

<template>
    <div
        class="chat-container"
        ref="containerRef"
    >
        <div
            v-if="emptyMessages"
            class="empty"
        >
            {{ t('mc.chat.empty') }}
        </div>

        <div v-else>
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-container {
    max-height: 500px;
    overflow-y: auto;
    background: var(--p-surface-800);
    padding: $indent-x2;
    border-radius: var(--p-inputtext-border-radius);
    outline-color: transparent;
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface-600) var(--p-surface-800);
    background: var(--p-select-background);

    .empty {
        color: var(--p-surface-500);
    }
}
</style>
