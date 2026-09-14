<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useNotify } from "@/composables/notify/use-notify"
import { HttpError } from "@/api"
import * as filesAPI from "@/api/modules/files/files"
import BBlockquote from "@c/common/b-blockquote/b-blockquote.vue"
import BButtonDownload from "@c/common/b-button/b-button-download.vue"
import BDivider from "@c/common/b-divider/b-divider.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { downloadExternalFile } from "@/lib/files"

const notify = useNotify()
const { t } = useI18n()

const isLoadingNotification = ref(false)
const isLoadingInstruction = ref(false)

async function handleNotificationDownload() {
    if (isLoadingNotification.value) return

    isLoadingNotification.value = true

    try {
        const fileBlob = await filesAPI.downloadPartnerFile("video-analytics", "notification.docx")

        if (fileBlob instanceof HttpError) {
            notify.error(t("mc.common.files.notFound"))
            return
        }

        if (fileBlob instanceof Blob) {
            downloadExternalFile(fileBlob, "Стандарт IVIDEON.docx")
        }
    } finally {
        isLoadingNotification.value = false
    }
}

async function handleInstructionDownload() {
    if (isLoadingInstruction.value) return

    isLoadingInstruction.value = true

    try {
        const fileBlob = await filesAPI.downloadPartnerFile("video-analytics", "instruction.pdf")

        if (fileBlob instanceof HttpError) {
            notify.error(t("mc.common.files.notFound"))
            return
        }

        if (fileBlob instanceof Blob) {
            downloadExternalFile(fileBlob, "Инструкция по подключению.pdf")
        }
    } finally {
        isLoadingInstruction.value = false
    }
}
</script>

<template>
    <portal-page
        title="Система видеoаналитики IVIDEON"
        class="video-analytics-view"
    >
        <portal-card title="Новый стандарт сети от 18.08.2026">
            <div class="content">
                <p>
                    Коллеги, делимся с вами важным обновлением, которое станет следующим шагом в развитии нашей сети.
                </p>

                <p>
                    Франчайзи продолжает расти — сегодня это более 180 филиалов, и с таким масштабом
                    перед нами стоит задача сохранять единый высокий стандарт качества во всех точках,
                    при этом снижая влияние человеческого фактора.
                </p>

                <p>
                    С августа мы начинаем внедрение нового инструмента контроля качества на базе
                    искусственного интеллекта. Это система видеоаналитики от компании IVIDEON
                    (сотрудничают с Dodo, CDEK, ПИК, Тинькофф и другими компаниями), которая будет помогать
                    автоматически отслеживать важные операционные моменты и формировать отчёты по ним.
                </p>

                <b-blockquote>
                    <p class="mb-x0">
                        <strong>Важно:</strong> этот инструмент НЕ создается для штрафов или наказаний.
                        Материалы с камер не будут использоваться как способ давления на партнёров или команды.
                    </p>
                </b-blockquote>

                <b-button-download
                    label="Стандарт IVIDEON.docx"
                    :loading="isLoadingNotification"
                    @click="handleNotificationDownload"
                />
            </div>
        </portal-card>

        <portal-card title="Что даёт система владельцу и офису?">
            <div class="content">
                <p>
                    Для владельца это дополнительный инструмент управления:
                </p>

                <ul>
                    <li>быстрее замечать системные проблемы;</li>
                    <li>понимать реальные зоны роста команды;</li>
                    <li>обсуждать с сотрудниками конкретные ситуации на основе фактов;</li>
                    <li>повышать качество сервиса и эффективность работы филиала.</li>
                </ul>

                <p>
                    Для офиса этот инструмент позволит видеть общие тренды по сети,
                    анализировать повторяющиеся ситуации и создавать решения, которые помогут
                    всем партнёрам развиваться быстрее.
                </p>

                <p>
                    Мы понимаем, что любой новый инструмент контроля может вызывать вопросы.
                    Для нас важно подчеркнуть: это не про вмешательство в ваш бизнес,
                    а про поддержку партнёров и создание единого уровня качества внутри большой сети.
                </p>
            </div>
        </portal-card>

        <portal-card title="Как работает отчётность и условия подключения">
            <div class="content">
                <p>
                    <strong>Формат отчётов:</strong>
                </p>
                <p>
                    Telegram-бот будет отправлять 2 раза в течение дня отчёт
                    с нарушениями по чек-листу (внешний вид, опоздание, сон во время смены, улыбка администратора,
                    встреча гостя с выходом из-за стойки и т. д.).
                </p>

                <b-divider />

                <p>
                    <strong>Финансовые условия:</strong>
                </p>

                <ul>
                    <li><strong>Стоимость подписки на видеоаналитику:</strong> 2 499 ₽ в месяц.</li>
                    <li>
                        <strong>Облако хранения (платеж раз в год):</strong> 3 360 ₽ за одну камеру
                        (минимум 2 камеры на филиал, учитывайте планировку).
                    </li>
                    <li>Договор NDA заключается индивидуально с каждым франчайзи.</li>
                    <li>Счёт выставляет IVIDEON напрямую.</li>
                </ul>

                <b-blockquote>
                    <p class="mb-x0">
                        Договорились с IVIDEON, что заходим всей сетью, поэтому выбили для нас хорошие условия.
                    </p>
                    <p class="mb-x0">
                        <strong>Срок подключения для всех филиалов:</strong> до 25 октября 2026 г.
                    </p>
                </b-blockquote>

                <b-button-download
                    label="Инструкция по подключению.pdf"
                    :loading="isLoadingInstruction"
                    @click="handleInstructionDownload"
                />
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.video-analytics-view {
    .content {
        @include text-content;
    }
}
</style>
