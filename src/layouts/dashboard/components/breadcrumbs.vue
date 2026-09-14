<script setup lang="ts">
import { computed, ref } from "vue"
import Breadcrumb from "primevue/breadcrumb"
import { useBreadcrumbs } from "@/composables/breadcrumbs/use-breadcrumbs"

const { breadcrumbs } = useBreadcrumbs()

const home = ref({
    label: "Панель администратора",
})

const lastCrumb = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1])
</script>

<template>
    <div class="breadcrumbs">
        <Breadcrumb
            :home="home"
            :model="breadcrumbs"
        >
            <template #separator>/</template>
            <template #item="{ item }">
                <span
                    class="breadcrumb-item-text"
                    :class="{
                        'breadcrumb-last': item === lastCrumb
                    }"
                >
                    {{ item.label }}
                </span>
            </template>
        </Breadcrumb>
    </div>
</template>

<style scoped lang="scss">
.breadcrumbs {
    display: flex;
    align-items: center;

    .breadcrumb-item-text {
        font-size: $font-size-h4;
        font-weight: 500;
        white-space: nowrap;
        color: var(--p-breadcrumb-item-color);
    }

    .breadcrumb-last {
        color: var(--p-breadcrumb-last-color);
    }
}
</style>
