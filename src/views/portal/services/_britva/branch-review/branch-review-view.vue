<script setup lang="ts">
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
</script>

<template>
    <portal-page
        class="branch-review-view"
        title="Внеплановый разбор филиала"
    >
        <portal-card title="Внеплановый разбор филиала">
            <div class="employees">
                <b-image
                    src="employees/grechishnikov.jpg"
                    width="120"
                    height="120"
                    rounded
                />

                <b-image
                    src="employees/filippov.jpg"
                    width="120"
                    height="120"
                    rounded
                />

                <div class="content">
                    <ul>
                        <li>Длительность — до 4 часов</li>
                        <li>Стоимость — 10 000 рублей</li>
                        <li>Присутствие владельца обязательно.</li>
                    </ul>
                </div>
            </div>

            <div class="content">
                <p>
                    Что входит в разбор:
                </p>

                <ul>
                    <li>Аудит с указанием ошибок и предложения по решению выявленных проблем и нарушений;</li>
                    <li>Разбор общих показателей филиала и каждого сотрудника индивидуально;</li>
                    <li>Поиск точек роста оборота филиала и клиентского сервиса;</li>
                    <li>Проверка продуктивности ведения yclients;</li>
                    <li>Проверка информации филиала в геосервисах;</li>
                    <li>Проработка с командой требований и рекомендаций сети;</li>
                    <li>Разъяснение стандартов сети «из первых уст»;</li>
                    <li>Диалог с командой — ответы на все интересующие сотрудников вопросы.</li>
                </ul>
            </div>
        </portal-card>
    </portal-page>
</template>

<style scoped lang="scss">
.branch-review-view {
    .employees {
        display: flex;
        gap: $indent-x2;
        margin-bottom: $indent-x2;

        :deep(.b-image) {
            img {
                object-fit: cover;
                object-position: top;
            }
        }
    }

    .content {
        @include text-content;
    }
}
</style>
