<script setup lang="ts">
const mapIframeSrc = "https://yandex.ru/map-widget/v1/?um=constructor%3Ab29933f89d4b11dfcf30883ac87f68831dbe7d58fde61097ee34dead0fe2dd98&source=constructor&ll=37.617635%2C55.755817&z=12&scroll=false"
</script>

<template>
    <div class="map-container">
        <iframe
            :src="mapIframeSrc"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
        />
    </div>
</template>

<style scoped lang="scss">
.map-container {
    width: 100%;
    height: calc(100vh - 193px);
    min-height: 300px;
    overflow: hidden;
    border-radius: var(--p-border-radius-md);
    background-color: var(--p-portal-card-background);

    iframe {
        display: block;
    }
}
</style>
