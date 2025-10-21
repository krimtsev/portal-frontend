<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalInformationMenu from "@c/portal/portal-information-menu/portal-information-menu.vue"
import { sections } from "@v/portal/_britva/home/data/home-data"
import { portalPaths } from "@r/portal/path"
import { PortalRouteName } from "@r/portal/route-names"
import PortalUserAnalyticsChart from "@c/portal/portal-charts/portal-user-analytics-chart.vue"
</script>

<template>
    <div class="home-view">
        <div class="grid">
            <div class="col-8 mob-col-12">
                <portal-information-menu :sections="sections" />
            </div>

            <div class="col-4 mob-col-12">
                <portal-card
                    title="Поиск сертификатов"
                    :path="portalPaths.Certificates"
                    menu-title
                    class="certificate-block"
                >
                    <div class="image-block">
                        <b-image
                            src="template/gift-card.png"
                            full
                         />
                    </div>
                </portal-card>
            </div>

            <div class="col-4 mob-col-12">
                <div class="grid flex-grow">
                    <div class="col-12">
                        <portal-card
                            title="Облако файлов"
                            :path="{
                                 name: PortalRouteName.Cloud
                            }"
                            menu-title
                            path-position-left
                            class="files-block"
                        >
                            <b-image src="template/files.png" height="195px" />
                        </portal-card>
                    </div>

                    <div class="col-12">
                        <portal-card
                            title="Важно!"
                            menu-title
                            class="important-block"
                        >
                            <p class="mb-x0">Оплатите 2ГИС до 20 мая 2025 г.</p>
                        </portal-card>
                    </div>
                </div>
            </div>

            <div class="col-4 mob-col-12 row-span">
                <portal-card
                    title="Аналитика показателей (в разработке)"
                    menu-title
                >
                    <portal-user-analytics-chart />
                </portal-card>
            </div>

            <div class="col-4 mob-col-12">
                <div class="grid flex-grow">
                    <div class="col-12">
                        <portal-card
                            title="Админам"
                            menu-title
                            class="admin-block"
                            :background="{
                                src: 'template/admin-card-bg.png',
                                height: '130',
                            }"
                            path="https://britva.tech/britva"
                        >
                        </portal-card>
                    </div>

                    <div class="col-12">
                        <portal-card
                            title="Отправить заявку"
                            menu-title
                            class="request-block"
                        >

                        </portal-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$min-height: 195px;

.home-view {
    display: flex;
    flex-direction: column;
    gap: $indent-x1;

    :deep(.portal-card) {
        height: 100%;
    }

    .certificate-block {
        :deep(.p-image) {
            img {
                width: auto;
            }
        }

        .image-block {
            @include flex-center;

            height: 100%;
        }
    }

    .request-block {
        min-height: $min-height;
    }

    .files-block {
        position: relative;
        min-height: $min-height;

        :deep(.b-image) {
            position: absolute;
            right: 0;
            top: $indent-x1;
        }
    }

    .admin-block {
        position: relative;
        background: $partner-revers-gradient;
        border: 1px solid var(--p-portal-card-background);
        min-height: $min-height;
    }

    .important-block {
        background: var(--p-primary-500);
        min-height: $min-height;

        &:deep() {
            .card-title {
                color: var(--p-surface-950);
            }
            .card-content {
                display: flex;
                align-items: end;
                color: var(--p-surface-950);
                padding-left: $indent-x3;
            }
        }
    }
}
</style>
