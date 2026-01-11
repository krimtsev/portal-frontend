<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"

const props = defineProps<{
    title?: string
}>()
</script>

<template>
    <article class="b-form-card">
        <section>
            <div
                v-if="props.title"
                class="title"
            >
                <b-title
                    :title="props.title"
                    variant="sm"
                />
            </div>

            <slot />
        </section>
    </article>
</template>

<style scoped lang="scss">
.b-form-card {
    background-color: var(--p-dashboard-card-background);
    padding: $indent-x2;

    .title {
        margin-bottom: $indent-x3;
    }
}
</style>
