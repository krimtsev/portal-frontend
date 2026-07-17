<script setup lang="ts">
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"

const props = defineProps<{
    title:     string
    value:     string | number
    status?:   "new" | "waiting" | "success"
    subtext?:  string
    isLoading: boolean
}>()
</script>

<template>
    <b-skeleton
        v-if="props.isLoading"
        width="100%"
        class="panel-card"
    />

    <div
        v-else
        class="panel-card"
        :class="status ? `status-${status}` : ''"
    >
        <div class="panel-card-header">
            <span class="label"> {{ props.title }} </span>
            <span
                v-if="status"
                class="status-indicator"
            />
        </div>

        <div class="panel-card-wrapper">
            <span class="value">{{ props.value }}</span>
            <span
                v-if="props.subtext"
                class="subtext"
            >
                {{ props.subtext }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel-card {
    @include list-view;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 8rem;
    padding: $indent-x2;
    border: 1px solid var(--p-surface-600);

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &-wrapper {
        display: flex;
        align-items: baseline;
        gap: $indent-x1;
        margin-top: $indent-x1;

        .value {
            @include h2;

            font-weight: 800;
        }

        .subtext {
            @include small-text;

            color: var(--p-surface-400);
        }
    }

    .status-indicator {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        display: inline-block;
        background-color: var(--p-slate-400);
    }

    &.status-new {
        .value {
            color: var(--p-blue-500);
        }

        .status-indicator {
            background-color: var(--p-blue-500);
        }
    }

    &.status-waiting {
        .value {
            color: var(--p-orange-500);
        }

        .status-indicator {
            background-color: var(--p-orange-500);
        }
    }

    &.status-success {
        .value {
            color: var(--p-green-500);
        }

        .status-indicator {
            background-color: var(--p-green-500);
        }
    }
}
</style>
