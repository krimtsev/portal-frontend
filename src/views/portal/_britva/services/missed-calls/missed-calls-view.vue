<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalUserCard from "@c/portal/portal-user-card/portal-user-card.vue"
import BButton from "@c/common/b-button/b-button.vue"
import { downloadFile } from "@/lib/files"
import { useI18n } from "vue-i18n"
import { getPublicLink } from "@/lib/link.ts"
import PortalPage from "@c/portal/portal-page/portal-page.vue"

const { n } = useI18n()

async function handleDownload() {
    const url = getPublicLink("docs/britva-service-bot.pdf")
    downloadFile(url, "britva-service-bot.pdf")
}
</script>

<template>
    <portal-page
        class="missed-calls-view"
        title="Сервис пропущенных звонков"
    >
        <p class="mb-x4">
            Мы запустили телеграм-бота, который присылает в ваши каналы или группы информацию о
            пропущенных звонках.
            А администраторы реагируют на эти уведомления и повышают вашу прибыль!
        </p>

        <portal-card title="Как все это работает?">
            <div class="content">
                <p>
                    Каждую минуту система автоматизации проверяет звонки на стороне Mango-телефонии и
                    забирает по ним информацию к нам на портал.
                    После этого информация сортируется и отправляется в соответствующий партнеру
                    телеграм-канал.
                    Далее в работу вступают ваши администраторы, которые должны перезвонить клиенту из
                    уведомления и после отписаться о проделанной работе.
                </p>
            </div>
        </portal-card>

        <portal-card title="Чем это полезно для вас?">
            <div class="content">
                <ul>
                    <li>Вы видите как часто ваши администраторы пропускают звонки.</li>
                    <li>Вы видите как быстро администраторы перезванивают по уведомлениям.</li>
                    <li>
                        Вы видите конверсию этих перезвонов в записи и повышаете свою клиентоориентированность.
                    </li>
                    <li>
                        В конце дня получаете статистику по всем вызовам, чтобы оценить нагрузку по звонкам.
                    </li>
                    <li>
                        LTV (LIFE TIME VALUE) – прибыль компании от одного клиента за все время
                        сотрудничества с ним или сколько приносят вам один клиент.
                        Наши инструменты аналитики показали {{ n(16781, "currency") }}.
                    </li>
                </ul>
            </div>
        </portal-card>

        <b-title
            title="Как это выглядит?"
            class="my-x4"
        />

        <b-image src="services/missed-calls.png" />

        <b-title
            title="Сколько это стоит?"
            class="my-x4"
        />

        <div class="grid">
            <div class="col-4">
                <portal-card>
                    <div class="tariff">
                        <b-image src="template/two_gis.png" />

                        <b-title
                            title="Звонки"
                            variant="md"
                            class="mb-x2"
                        />

                        <p>1600 рублей</p>

                        <p>Всего по стоимости 1 мужской стрижки</p>
                    </div>
                </portal-card>
            </div>

            <div class="col-4">
                <portal-user-card
                    avatar="template/first-avatar.png"
                    telnum="79833130820"
                >
                    <div class="text-center">
                        <p class="mb-x0">Для подключения напишите</p>
                        <p class="mb-x0">Диме Крымцеву</p>
                    </div>
                </portal-user-card>
            </div>
        </div>

        <portal-card class="mt-x2">
            <div class="content">
                <p class="mb-x0">
                    Мы можем подключить все ваши филиалы в один канал. И даже разные
                    проекты (SODA и BRITVA).
                </p>
                <p class="mb-x0">
                    Звонки могут быть пропущенные по разным причинам. Это может как халатность
                    сотрудника, так и проблемы с телефонией, интернетом или даже разрядившийся телефон.
                </p>
                <p>Удобно наблюдать в одном месте за всеми своими филиалами.</p>
            </div>
            <b-button
                label="Презентация продукта"
                download
                @click="handleDownload"
            />
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.missed-calls-view {
    .content {
        @include text-content;
    }

    .tariff {
        display: flex;
        flex-direction: column;
        align-items: center;

        p + p {
            margin-top: $indent-x2;
        }
    }
}
</style>
