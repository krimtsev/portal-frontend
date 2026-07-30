<script setup lang="ts">
import { useRouter } from "vue-router"
import BSvg from "@c/common/b-svg/b-svg.vue"

const emit = defineEmits<{
    (e: "click"): void
}>()

const props = withDefaults(defineProps<{
    iconName: string
    title:    string
    path?:    string
    announce: string
    hint?:    string
}>(), {
    path: "",
    hint: "",
})

const router = useRouter()

const goTo = () => {
    if (props.path) {
        router.push(props.path)
    } else {
        emit("click")
    }
}
</script>

<template>
    <div
        class="settings-card"
        @click="goTo"
    >
        <div class="icon">
            <b-svg
                :name="iconName"
                size="1.6rem"
            />
        </div>
        <div class="title card-header">
            {{ title }}
        </div>
        <div class="text">
            <div class="announce">
                {{ announce }}
            </div>
            <div
                v-if="hint"
                class="hint"
            >
                {{ hint }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.settings-card {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "icon title"
        "icon text";
    column-gap: $indent-x2;
    row-gap: $indent-x1;
    align-content: start;
    padding: $indent-x3;
    min-height: 150px;
    background-color: var(--p-dashboard-card-background);
    border: 1px solid var(--p-surface-600);
    border-radius: $indent-x2;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;

    &:hover {
        border-color: var(--p-primary-800);

        .title {
            color: var(--p-primary-500);
        }
    }

    .icon {
        grid-area: icon;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 2px;
        color: var(--p-surface-0);
    }

    .title {
        @include card-title;

        color: var(--p-surface-0);
    }

    .text {
        grid-area: text;
        max-width: 350px;

        .announce {
            @include card-description;

            color: var(--p-surface-400);
        }

        .hint {
            @include small-text;

            margin-top: $indent-x1;
            color: var(--p-surface-400);
        }
    }
}
</style>
