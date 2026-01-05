<script setup lang="ts">
import { type ChatMessageFile } from "@c/chat/definitions/chat-message"

const props = defineProps<{
    items: ChatMessageFile[]
}>()

const emit = defineEmits<{
    (e: "click", value: ChatMessageFile): void
}>()

</script>

<template>
    <div class="chat-files">
        <ul>
            <li
                v-for="(file, idx) in props.items"
                :key="idx"
            >
                <div
                    class="link"
                    @click="emit('click', file)"
                >
                    {{ file.title }}.{{ file.ext }}
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.chat-files {
    margin-left: 16px;
    margin-top: 8px;

    ul {
        li + li {
            margin-top: 4px;
        }
    }

    .link {
        cursor: pointer;

        &:hover {
            color: var(--p-surface-600);
        }

        &:active {
            color: var(--p-surface-400);
        }
    }
}
</style>
