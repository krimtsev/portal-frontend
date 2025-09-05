<script setup lang="ts">
import BTitle from "@c/common/b-title/b-title.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        class="certificate-view"
        title="Подарочные сертификаты"
        right-image="template/gift.png"
    >
        <div class="grid">
            <div class="col-6">
                <portal-card title="Годовой абонемент на стрижки и уход">
                    <div class="content">
                        <ul>
                            <li>Физическая карта, выданная Центральным офисом</li>
                            <li>Идентифицируется по номеру на обратной стороне</li>
                            <li>Активируется при продаже в системе Yclients</li>
                        </ul>

                        <p>Каждый физический сертификат состоит из:</p>

                        <ul>
                            <li>Карточки с номиналом и правилами использования</li>
                            <li>Открытки с пожеланиями</li>
                            <li>Фирменного конверта с логотипом BRITVA</li>
                        </ul>

                        <p>Используется в любом филиале сети BRITVA.</p>
                    </div>
                </portal-card>
            </div>

            <div class="col-6">
                <portal-card title="Электронный сертификат">
                    <div class="content">
                        <ul>
                            <li>Заказан и оплачен онлайн через сайт britvabarber.ru</li>
                            <li>Отправляется по e-mail</li>
                            <li>Автоматически активируется в Yclients при оплате через сайт</li>
                        </ul>

                        <p>Каждый электронный сертификат:</p>

                        <ul>
                            <li>Отправляется клиенту в виде СМС с ссылкой</li>
                            <li>По ссылке открывается страница сертификата на сайте</li>
                            <li>На странице указан номинал, срок действия и код</li>
                        </ul>

                        <p>Используется в любом филиале сети BRITVA.</p>
                    </div>
                </portal-card>
            </div>

            <div class="col-12">
                <portal-card title="Как продаются и активируются бумажные сертификаты">
                    <div class="content">
                        <ul>
                            <li>Физический сертификат активируется только после пробития в Yclients</li>
                            <li>
                                У каждого филиала — своя нумерация, которая записана в таблице
                                "Поиск по сертификатам"
                            </li>
                            <li>Подробная инструкция по пробитию — в видео-уроке по Yclients</li>
                        </ul>
                    </div>
                </portal-card>
            </div>
        </div>

        <b-title
            title="Если заказывают сертификаты через сайт"
            class="mt-x2 mb-x3"
        />

        <div class="grid">
            <div class="col-6">
                <portal-card title="Заказ физических сертификатов">
                    <div class="content">
                        <ul>
                            <li>Клиент оформляет заказ на сайте</li>
                            <li>Выбирает оплату наличными в филиале при получении</li>
                            <li>Заказ автоматически направляется в нужный филиал по e-mail</li>
                            <li>Контроль заказов — на вашей почте</li>
                        </ul>
                    </div>
                </portal-card>
            </div>

            <div class="col-6">
                <portal-card title="Заказ электронных сертификатов">
                    <div class="content">
                        <ul>
                            <li>Клиент оплачивает на сайте</li>
                            <li>Центральный офис отправляет физический сертификат доставкой</li>
                            <li>Сертификат действует по всей сети</li>
                        </ul>
                    </div>
                </portal-card>
            </div>

            <div class="col-12">
                <portal-card title="Как работать с таблицей сертификатов">
                    <div class="content">
                        <ol>
                            <li>Откройте вкладку «Поиск по сертификатам»</li>
                            <li>Введите номер сертификата без начальных нулей</li>
                            <li>Система отобразит:
                                <ul>
                                    <li>номинал или услугу</li>
                                    <li>соответствующий филиал</li>
                                </ul>
                            </li>
                        </ol>

                        <p>Таблица доступна только для просмотра, редактирование закрыто</p>
                        <p>
                            Если возникают ошибки при пробитии в Yclients, таблица поможет
                            проверить корректность и выявить расхождения.
                        </p>
                    </div>
                </portal-card>

                <portal-card title="Взаиморасчеты по сертификатам">
                    <div class="content">
                        <p>
                            Если клиент использует сертификат в другом филиале (не в том, где он был куплен),
                            принимающий филиал получает 50% от суммы визита от филиала-продавца.
                        </p>
                    </div>
                </portal-card>

                <portal-card title="Как правильно пробивать сертификат">
                    <div class="content">
                        <ul>
                            <li>Новые сертификаты имеют уникальные номера</li>
                            <li>Для активации вводится только номер с обратной стороны карточки</li>
                            <li>Без лишних символов или пробелов</li>
                        </ul>

                        <p>Если есть проблемы по физическим сертификатам, можете писать Диме</p>
                        <p>Если есть проблемы по физическим сертификатам, можете писать Артему</p>
                    </div>
                </portal-card>
            </div>
        </div>
    </portal-page>
</template>

<style lang="scss" scoped>
.certificate-view {
    .content {
        @include text-content;
    }
}
</style>
