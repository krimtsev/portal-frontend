<script setup lang="ts">
import { ref } from "vue"
import PrimeButton from "primevue/button"

withDefaults(defineProps<{
    noPaddings?: boolean
    showMore?: boolean
}>(), {
    noPaddings: false,
    showMore: false
})

const isExpanded = ref(false)

function onToggle() {
    isExpanded.value = !isExpanded.value
}
</script>

<template>
    <div
        class="b-toolbar"
        :class="{
            'no-paddings': noPaddings,
        }"
    >
        <div class="b-toolbar-first">
            <slot />

            <div
                v-if="showMore"
                class="more ml-x2"
            >
                <prime-button
                    :icon="isExpanded ? 'pi pi-times' : 'pi pi-ellipsis-h'"
                    variant="text"
                    @click="onToggle"
                />
            </div>

            <div class="right-side">
                <slot name="right-side" />
            </div>
        </div>

        <transition name="basic-fade">
            <div
                v-show="isExpanded"
                class="b-toolbar-second"
            >
                <slot name="more" />
            </div>
        </transition>
    </div>
</template>

<style scoped lang="scss">
.b-toolbar {
    width: 100%;
    padding: $indent-x2 $indent-x2 0 $indent-x2;
    border-top-left-radius: $indent-x2;
    border-top-right-radius: $indent-x2;
    background-color: var(--p-dashboard-card-background);

    &.no-paddings {
        padding: 0;
    }

    &-first {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;

        .right-side {
            @include flex-end;

            flex-grow: 1;
            align-items: center;
            min-height: 40px;
        }
    }

    &-second {
        margin-top: $indent-x2;
    }
}
</style>
