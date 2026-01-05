<script setup lang="ts">
import { ref } from "vue"

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
        <slot />
    </div>
</template>

<style scoped lang="scss">
.chat-container {
    max-height: 500px;
    overflow-y: auto;
    background: var(--p-surface-800);
    padding: $indent-x2;
    border-radius: var(--p-textarea-border-radius);
    outline-color: transparent;
    box-shadow: var(--p-textarea-shadow);
}
</style>
