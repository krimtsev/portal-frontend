<script setup lang="ts">
import { computed } from "vue"
import { imageSrc } from "@h/images/images"
import { DateTime } from "luxon"
import { ChatMessageType } from "@c/chat/definitions/chat-message"
import PrimeAvatar from "primevue/avatar"

const props = defineProps<{
    text: string | string[]
    type?: ChatMessageType
    name?: string
    login?: string
    avatar?: string
    stamp?: string
    rounded?: boolean
}>()

const type = computed<ChatMessageType>(() => props.type ?? ChatMessageType.Received)

const avatarImage = computed(() => imageSrc(props.avatar))
const avatarLabel = computed(() => props.login ? props.login[0].toUpperCase() : "")

const stamp = computed(() => {
    if (!props.stamp) return ""
    return DateTime.fromISO(props.stamp)
        .toFormat("dd.MM.yyyy H:mm:ss")
})

const messages = computed((): string[] => {
    if (!props.text) return []
    if (Array.isArray(props.text)) return props.text
    return [props.text]
})

const shape = computed((): string =>  props.rounded ? "circle" : "square")
</script>

<template>
    <div
        :class="[
            'chat-message',
            `chat-message-${type}`,
        ]"
    >
        <div class="container">
            <div class="avatar-container">
                <img
                    v-if="avatarImage"
                    :src="avatarImage"
                    class="avatar"
                    :class="[
                        `avatar-${type}`,
                    ]"
                />
                <prime-avatar
                    v-else-if="avatarLabel"
                    :label="avatarLabel"
                    :shape="shape"
                />
            </div>

            <div>
                <div
                    v-if="props.name"
                    class="name"
                >
                    {{ props.name }}
                </div>

                <div
                    :class="[
                        'text',
                        `text-${type}`,
                    ]"
                >
                    <div class="text-content">
                        <div
                            v-for="(text, idx) in messages"
                            :key="idx"
                        >
                            {{ text }}
                        </div>

                        <slot name="files" />

                        <div
                            v-if="stamp"
                            class="stamp"
                        >
                            {{ stamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-message {
    margin-bottom: 16px;

    .container {
        display: flex;
        flex-wrap: nowrap;
        align-items: flex-end;
        flex-direction: row;
    }

    .name {
        margin-bottom: 4px;
    }

    .text {
        background: currentColor;
        padding: 8px 16px 8px 8px;
        word-break: break-word;
        position: relative;
        border-radius: 8px 8px 8px 0;

        &:last-child {
            min-height: 48px;

            &:before {
                content: "";
                position: absolute;
                bottom: 0;
                width: 0;
                height: 0;
                right: 100%;
                border-right: 0 solid transparent;
                border-left: 8px solid transparent;
                border-bottom: 8px solid currentColor;
            }
        }

        &-received {
            color: var(--p-chat-received-color);
        }

        &-sent {
            color: var(--p-chat-sent-color);
        }

        &-system {
            color: var(--p-chat-system-color);
        }
    }

    .text-content {
        color: var(--p-surface-950);
        white-space: pre-wrap;
    }

    .stamp {
        display: block;
        color: inherit;
        margin-top: 4px;
        opacity: .6;
        font-size: 0.85714rem;
        text-align: right;
    }

    .avatar-container {
        margin-right: 8px;

        .avatar {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            min-width: 40px;

            border-style: solid;
            border-width: 2px;

            &-received {
                border-color: var(--p-chat-received-color);
            }

            &-sent {
                border-color: var(--p-chat-sent-color);
            }

            &-system {
                border-color: var(--p-chat-system-color);
            }
        }
    }
}
</style>
