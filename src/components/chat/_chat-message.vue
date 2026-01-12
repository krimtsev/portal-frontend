<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    text: string | string[]
    sent?: boolean
    name?: string
    avatar?: string
    stamp?: string
}>()

const type = computed(() => {
    return props.sent ? "sent" : "received"
})
</script>

<template>
    <div
        :class="[
            'chat-message',
            `chat-message-${type}`,
        ]"
    >
        <div
            :class="[
                'chat-container',
                `chat-container-${type}`,
            ]"
        >
            <img
                v-if="props.avatar"
                :src="props.avatar"
                class="chat-avatar"
            />
            <div>
                <div
                    v-if="props.name"
                    :class="[
                        'chat-name',
                        `chat-name-${type}`,
                    ]"
                >
                    {{ props.name }}
                </div>
                <div
                    :class="[
                        'chat-text',
                        `chat-text-${type}`,
                    ]"
                >
                    <div
                        :class="[
                            'chat-text-content',
                            `chat-text-content-${type}`,
                        ]"
                    >
                        <div> {{ props.text }} </div>
                        <div
                            v-if="props.stamp"
                            class="chat-stamp"
                        >
                            {{ props.stamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-message {
    margin-bottom: $indent-x1;

    .chat-container {
        display: flex;
        flex-wrap: nowrap;
        align-items: flex-end;
        flex-direction: row;

        &-sent {
            flex-direction: row-reverse;
        }
    }

    .chat-name {
        margin-bottom: 4px;

        &-sent {
            text-align: right;
        }
    }

    .chat-text {
        background: currentColor;
        padding: $indent-x1;
        word-break: break-word;
        position: relative;


        &:last-child {
            min-height: 48px;

            &:before {
                content: "";
                position: absolute;
                bottom: 0;
                width: 0;
                height: 0;
            }
        }

        &-received {
            color: #81c784;
            border-radius: 4px 4px 4px 0;

            &:last-child {
                &:before {
                    right: 100%;
                    border-right: 0 solid transparent;
                    border-left: 8px solid transparent;
                    border-bottom: 8px solid currentColor;
                }
            }
        }

        &-sent {
            color: #e0e0e0;
            border-radius: 4px 4px 0;

            &:last-child {
                &:before {
                    left: 100%;
                    border-left: 0 solid transparent;
                    border-right: 8px solid transparent;
                    border-bottom: 8px solid currentColor;
                }
            }
        }
    }

    .chat-text-content {
        color: #000;
    }

    .chat-stamp {
        display: block;
        color: inherit;
        margin-top: 4px;
        opacity: .6;
        font-size: small;
    }

    .chat-avatar {
        border-radius: 50%;
        width: 48px;
        height: 48px;
        min-width: 48px;
    }
}
</style>
