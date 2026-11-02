<script setup lang="ts">
import { ref } from "vue"
import * as filesAPI from "@/api/modules/files/files"
import BImage from "@c/common/b-image/b-image.vue"

const imageUrl = ref(filesAPI.getStorageLink("promo-dialogs", "ten_years.jpg"))
</script>

<template>
    <div class="britva-ten-years-template">
        <b-image
            :src="imageUrl"
            full
            alt="Britva — 10 лет"
        />
    </div>
</template>

<style scoped lang="scss">
.britva-ten-years-template {
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: $indent-x2;

    :deep(img) {
        display: block;
        width: 100%;
        min-height: 60vh;
    }
}
</style>
