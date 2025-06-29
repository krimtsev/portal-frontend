<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import InformationBlock from "@v/portal/home/components/information-block.vue"
import BImage from "@c/common/b-image/b-image.vue"

</script>

<template>
    <div class="home-view">
        <div class="grid">
            <div class="col-8">
                <information-block />
            </div>

            <div class="col-4">
                <portal-card
                    title="Поиск сертификатов"
                    path="/portal/certificates/search"
                >
                    <b-image src="template/gift-card.png" width="100%" />
                </portal-card>
            </div>

            <div class="col-4">
                <div class="grid">
                    <div class="col-12">
                        <portal-card title="Облако файлов">

                        </portal-card>
                    </div>

                    <div class="col-12">
                        <portal-card title="Важно">

                        </portal-card>
                    </div>
                </div>
            </div>

            <div class="col-4 row-span">
                <portal-card title="Аналитика показателей">

                </portal-card>
            </div>

            <div class="col-4">
                <div class="grid">
                    <div class="col-12">
                        <portal-card title="Админам">

                        </portal-card>
                    </div>

                    <div class="col-12">
                        <portal-card title="Отправить заявку">

                        </portal-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-view {
    display: flex;
    flex-direction: column;
    gap: $indent-x1
}
</style>
