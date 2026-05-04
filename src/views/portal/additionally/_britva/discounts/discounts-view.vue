<script setup lang="ts">
import { useI18n } from "vue-i18n"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"

const { n } = useI18n()
</script>

<template>
    <portal-page
        class="discounts-view"
        title="Корпоративная скидка"
    >
        <portal-card title="Партнерство BRITVA & SODA:">
            <div class="content">
                <ul>
                    <li>франчайзи BRITVA и SODA предоставляется скидка 20% на все услуги в SODA</li>
                    <li>всем сотрудникам предоставляется скидка 20% (кроме окрашиваний) на все услуги в SODA</li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Партнерство BRITVA x Massage by SODA:">
            <div class="content">
                <p>
                    Massage by Soda — ваши уютные студии массажа рядом с домом.
                    Проект от создателей BRITVA и Soda: здесь вы найдёте покой,
                    комфорт и истинное расслабление среди городской суеты.
                </p>

                <ul>
                    <li>франчайзи BRITVA предоставляется скидка 20% на услуги массажа</li>
                    <li>сотрудникам BRITVA предоставляется скидка 20% на услуги массажа</li>
                    <p>*кроме сеансов comfort zone</p>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Корпоративные тарифы Москва и Санкт-Петербург:">
            <div class="content">
                <p>Годовой абонемент: {{ n(23000, "currency") }}</p>
                <ul>
                    <li>Мультидоступ во все клубы сети</li>
                    <li>4 гостевых визита ежемесячно</li>
                    <li>Spirit.Box — набор скидок и подарков от наших партнёров</li>
                </ul>

                <p>Спецтариф на 3 месяца: от {{ n(6000, "currency") }} до {{ n(7200, "currency") }} (в зависимости от выбора клуба)</p>
                <ul>
                    <li>Spirit.Box</li>
                </ul>

                <p>Тариф с ежемесячной оплатой: {{ n(3300, "currency") }} (второй и последующие — {{ n(2500, "currency") }})</p>
                <ul>
                    <li>Мультидоступ во все клубы сети</li>
                    <li>Бесплатный доступ к спецпроектам</li>
                    <li>4 гостевых визита ежемесячно</li>
                    <li>Spirit.Box</li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Корпоративные тарифы для регионов:">
            <div class="content">
                <p>Годовой абонемент: {{ n(23000, "currency") }}</p>
                <ul>
                    <li>Мультидоступ во все клубы сети</li>
                    <li>4 гостевых визита ежемесячно</li>
                    <li>Spirit.Box — набор скидок и подарков от наших партнёров</li>
                </ul>

                <p>Годовой абонемент: {{ n(20000, "currency") }}</p>
                <ul>
                    <li>Доступ в 1 клуб сети</li>
                    <li>Spirit.Box — набор скидок и подарков от наших партнёров</li>
                </ul>

                <p>Тариф с ежемесячной оплатой: {{ n(3300, "currency") }} (второй и последующие — {{ n(2500, "currency") }})</p>
                <ul>
                    <li>Мультидоступ во все клубы сети</li>
                    <li>Бесплатный доступ к спецпроектам</li>
                    <li>4 гостевых визита ежемесячно</li>
                    <li>Spirit.Box</li>
                </ul>

                <p>Тариф с ежемесячной оплатой: {{ n(3000, "currency") }} (второй и последующие — {{ n(2300, "currency") }})</p>
                <ul>
                    <li>Доступ в 1 клуб сети</li>
                    <li>Spirit.Box</li>
                </ul>

                <p>Что входит в абонемент:</p>
                <ul>
                    <li>Безлимитный доступ</li>
                    <li>Мобильное приложение Spirit.Fitness с библиотекой упражнений и программами тренировок</li>
                    <li>Удобный режим работы и расположение</li>
                    <li>150+ единиц топового оборудования в каждом клубе</li>
                    <li>15+ направлений групповых программ каждый час</li>
                    <li>СПА-зона с сауной и хаммамом</li>
                    <li>Тестирование состава тела InBody без ограничений</li>
                    <li>🎁 Пробная тренировка с тренером бесплатно!</li>
                </ul>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.discounts-view {
    .content {
        @include text-content;
    }
}
</style>
