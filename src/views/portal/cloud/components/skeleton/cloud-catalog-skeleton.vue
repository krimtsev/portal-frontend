<script setup lang="ts">
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"

</script>

<template>
    <div class="cloud-catalog-skeleton">
        <b-skeleton class="skeleton" />
    </div>
</template>

<style scoped lang="scss">
.cloud-catalog-skeleton {
    position: relative;
    min-width: 406px;
    min-height: calc(279px + 30px);
    display: flex;
    align-items: self-end;

    .skeleton {
        border-radius: $indent-x4;
        width: 100% !important;
        min-height: 279px !important;
        overflow: hidden;
    }
}
</style>
