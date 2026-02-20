<script setup lang="ts">
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import { getPublicLink } from "@/lib/link"
import { downloadFile } from "@/lib/files"
import BButtonDownload from "@c/common/b-button/b-button-download.vue"

async function handleDownload() {
    const url = getPublicLink("docs/co-price.pdf")
    downloadFile(url, "co-price.pdf")
}
</script>

<template>
    <portal-page
        class="paid-co-view"
        title="Платные услуги центрального офиса"
    >
        <portal-card>
            <div class="content">
                <p> Документ, посвящённый платным услугам для партнеров сети барбершопов BRITVA! </p>

                <p>
                    Мы ценим каждое сотрудничество и понимаем, как важно для наших партнеров не только поддерживать
                    высокий уровень обслуживания, но и постоянно развивать свой бизнес. В этом файле мы собрали
                    информацию о платных услугах, которые помогут вам значительно повысить прибыль и улучшить
                    клиентский опыт.
                </p>

                <p>
                    Платные услуги — это не просто способ увеличить доход, но и возможность предложить вашим клиентам
                    больше ценного и уникального. Мы уверены, что внедрение этих услуг в вашем барбершопе станет
                    отличным дополнением к стандартным предложениям, а также поможет выделиться на фоне конкурентов и
                    укрепить лояльность клиентов.
                </p>

                <p>
                    Мы всегда готовы поддержать вас в этом процессе, предлагая подробные инструкции и помощь на всех
                    этапах. Ведь ваш успех — это наш успех, и мы уверены, что с помощью этих дополнительных
                    возможностей мы сможем сделать ваш бизнес ещё более прибыльным и успешным. Желаем удачи и роста
                    вашему бизнесу!
                </p>

                <b-button-download
                    label="Презентация"
                    @click="handleDownload"
                />
            </div>
        </portal-card>
    </portal-page>
</template>

<style scoped lang="scss">
.paid-co-view {
    .content {
        @include text-content;
    }
}
</style>
