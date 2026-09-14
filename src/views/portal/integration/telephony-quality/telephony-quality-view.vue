<script setup lang="ts">
import { ref } from "vue"
import PrimeImage from "primevue/image"
import * as filesAPI from "@/api/modules/files/files"
import BBlockquote from "@c/common/b-blockquote/b-blockquote.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"

const imageUrl = ref(filesAPI.getStorageLink("dialogic-ai", "image_1.jpg"))
</script>

<template>
    <portal-page
        title="Контроль качества телефонии DIALOGIC AI"
        class="telephony-quality-view"
    >
        <portal-card title="Новый стандарт сети от 18.08.2026">
            <div class="content">
                <p>
                    С августа мы начинаем внедрение нового инструмента контроля качества телефонии на
                    базе искусственного интеллекта — <strong>DIALOGIC AI</strong>.
                </p>
            </div>
        </portal-card>

        <portal-card title="Что делает система?">
            <div class="content">
                <ul>
                    <li>расшифровывает разговоры;</li>
                    <li>анализирует звонок по заданным критериям, словарям и чек-листам;</li>
                    <li>выявляет нарушения и ошибки;</li>
                    <li>позволяет разбирать конкретные разговоры на основе фактов;</li>
                    <li>формирует отчёты в Telegram по каждому звонку.</li>
                </ul>

                <p>
                    Для руководителя это дополнительный инструмент контроля качества.
                    Не нужно прослушивать десятки звонков вручную, чтобы понять,
                    что происходит в коммуникации с клиентами.
                </p>

                <p>
                    Таким образом, контроль качества становится регулярным
                    и ни один плохой звонок не пройдёт незамеченным.
                </p>

                <p>
                    Для офиса инструмент позволит видеть общие тренды по сети,
                    находить повторяющиеся ошибки и формировать решения, которые можно масштабировать на все филиалы.
                </p>

                <p>
                    Результаты анализа будут доступны в системе DIALOGIC AI как с телефона,
                    так и с компьютера, а также в боте в Telegram.
                </p>
            </div>

            <prime-image
                :src="imageUrl"
                alt="Как работает DIALOGIC AI"
                width="100%"
                preview
            />
        </portal-card>

        <portal-card title="Условия и стоимость">
            <div class="content">
                <ul>
                    <li><strong>Стоимость подключения:</strong> 2 999 ₽ в месяц с филиала.</li>
                    <li>Договор и условия использования оформляются отдельно.</li>
                </ul>

                <b-blockquote>
                    <p class="mb-x0">
                        Инструкция по подключению будет опубликована отдельным постом.
                    </p>
                </b-blockquote>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.telephony-quality-view {
    .content {
        @include text-content;
    }
}
</style>
