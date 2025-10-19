<script setup lang="ts">
import BSkeleton from "@c/common/b-skeleton/b-skeleton.vue"
</script>

<template>
<div class="cloud-file-row-skeleton">
    <div class="wrapper">
        <div class="icon">
            <b-skeleton
                size="39px"
                shape="circle"
            />
        </div>

        <div class="name">
            <b-skeleton
                height="1rem"
                width="20rem"
            />
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.cloud-file-row-skeleton {
    display: flex;
    flex-direction: row;

    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $indent-x2;
        min-height: 35px;
        width: auto;
    }
}
</style>

