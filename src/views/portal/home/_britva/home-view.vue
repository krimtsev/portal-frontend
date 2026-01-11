<script setup lang="ts">
import { onMounted, ref } from "vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalInformationMenu from "@c/portal/portal-information-menu/portal-information-menu.vue"
import { sections } from "@v/portal/home/_britva/data/home-data"
import { portalPaths } from "@r/portal/path"
import PortalUserAnalyticsChart from "@c/portal/portal-charts/portal-user-analytics-chart.vue"
import BButton from "@c/common/b-button/b-button.vue"
import type { MessageItem } from "@/api/modules/messages/messages"
import * as messagesAPI from "@/api/modules/messages/messages"
import { HttpError } from "@/api"
import { useNotify } from "@/composables/notify/use-notify"
import PortalMessages from "@c/portal/portal-messages/portal-messages.vue"
import { useRouter } from "vue-router"
import { ProfileRouteName } from "@r/profile/route-names"
import { PortalRouteName } from "@r/portal/route-names"
import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"

const router = useRouter()
const notify = useNotify()

const messages = ref<MessageItem[]>([])
const isLoading = ref(true)

onMounted(async () => {
    const data =  await messagesAPI.list()

    if (data instanceof HttpError) {
        notify.error()
        return false
    }

    messages.value = data.list
    isLoading.value = false
})
</script>

<template>
    <div class="home-view">
        <div class="grid">
            <div class="col-8 tablet-col-12 mobile-col-12">
                <portal-information-menu :sections="sections" />
            </div>

            <div class="col-4 tablet-col-6 mobile-col-12 tablet-row-span-2">
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

            <div class="col-4 tablet-col-6 mobile-col-12">
                <portal-card
                    title="Облако файлов"
                    :path="{
                        name: PortalRouteName.Cloud
                    }"
                    menu-title
                    path-position-left
                    class="files-block card-height"
                >
                    <b-image src="template/files.png" height="195px" />
                </portal-card>
            </div>

            <div
                v-glow="{ position: 'top-right' }"
                class="col-4 tablet-col-6 mobile-col-12 row-span-2"
            >
                <portal-card
                    title="Аналитика показателей (заработает позже)"
                    menu-title
                    class="card-height-x2"
                    class-content="d-flex align-items-end"
                >
                    <portal-user-analytics-chart />
                </portal-card>
            </div>

            <div class="col-4 mobile-col-12 tablet-col-6">
                <portal-card
                    title="Страница для администраторов"
                    menu-title
                    class="admin-block card-height"
                    :background="{
                        src: 'template/admin-card-bg.png',
                        height: '130',
                    }"
                    path="https://britva.tech/britva"
                >
                </portal-card>
            </div>

            <div class="col-4 mobile-col-12 tablet-col-6">
                <portal-messages
                    :is-loading="isLoading"
                    :messages="messages"
                    class="card-height"
                />
            </div>

            <div class="col-4 mobile-col-12 tablet-col-6">
                <portal-card
                    title="Популярные заявки"
                    menu-title
                    class="request-block card-height"
                    class-title="mb-x2"
                >
                    <div class="buttons-wrapper">
                        <b-button
                            label="Заявка на топ-мастера"
                            outline
                            @click="router.push({
                                name: ProfileRouteName.ProfileTicketSpecialist,
                                query: {
                                    qualification: Qualification.TobBarber
                                }
                            })"
                        />
                        <b-button
                            label="Заявка на бренд-мастера"
                            outline
                            @click="router.push({
                                name: ProfileRouteName.ProfileTicketSpecialist,
                                query: {
                                    qualification: Qualification.BrandBarber
                                }
                            })"
                        />
                        <b-button
                            label="Заявка на сертификат"
                            outline
                            @click="router.push({ name: ProfileRouteName.ProfileTicketCertificate })"
                        />
                        <b-button
                            label="Заявка на индивидуальное согласование"
                            outline
                            @click="router.push({ name: ProfileRouteName.ProfileTicketGeneral })"
                        />
                    </div>
                </portal-card>
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

    .card-height {
        max-height: $portal-card-min-height;
    }

    @media (min-width: $layout-desktop-width) {
        .card-height-x2 {
            max-height: calc(($portal-card-min-height * 2) + $indent-x1);
        }
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

        .buttons-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: $indent-x1;
            max-height: calc(2 * 40px + $indent-x1);
            overflow: hidden;
        }
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
}
</style>
