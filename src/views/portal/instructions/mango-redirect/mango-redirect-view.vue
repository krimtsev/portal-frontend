<script setup lang="ts">
import BLink from "@c/common/b-link/b-link.vue"
import BImage from "@c/common/b-image/b-image.vue"
import BDivider from "@c/common/b-divider/b-divider.vue"
import BBlockquote from "@c/common/b-blockquote/b-blockquote.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        class="mango-redirect-view"
        title="Настройка переадресации Mango-телефонии"
    >
        <div class="content">
            <p>
                Для настройки переадресации необходимо зайти на сайт
                <b-link label="lk.mango-office.ru" href="http://lk.mango-office.ru"/>
                и ввести данные от своего филиала.
                Если у Вас нет данных для авторизации, пишите Диме Крымцеву в
                <b-link label="WhatspApp" href="http://wa.me/79994845317"/>
            </p>

            <b-image
                src="instructions/mango_1.png"
                full
            />

            <b-blockquote>
                <p class="mb-x0">Пример:</p>
                <p class="mb-x0">login: 400111214/имяфилиала</p>
                <p class="mb-x0">pass: !Password123</p>
            </b-blockquote>

            <p>
                UPD: С 1 августа 2025 года авторизаця в личный кабинет происходит через почтовый адрес указаный в
                карточке сотрудника.
                Если его нет, то необходимо указать. Далее вам на этот электронный адрес приходит ссылка для
                сброса пароля, где вы задаете СВОЙ пароль.
                После авторизируетесь через свою почту и свой пароль. Вам будет приходить код двухфакторной аутентификации на указанную почту.
				Мы больше ваших данных для авторизаций не знаем.
            </p>

            <p>
                Вводим данные и попадаем на страницу с историей звонков. Теперь необходимо в верхнем меню
                выбрать "Сотрудники"
            </p>

            <b-image
                src="instructions/mango_2.png"
                full
            />

            <p>Выбираем сотрудника (он там будет один) и нажимаем на имя.</p>

            <b-image
                src="instructions/mango_3.png"
                full
            />

            <p>Откроется всплывающее окно. Переходим на вкладку "Телефония"</p>

            <b-image
                src="instructions/mango_4.png"
                full
            />

            <p>Нажимаем кнопку "Добавить номер"</p>

            <b-image
                src="instructions/mango_5.png"
                full
            />

            <p>
                Указываем в окне номер, на которым хотим сделать переадресацию. Рекомендуем указывать номер
                без плюса и начало с цифры 7.
            </p>

            <b-image
                src="instructions/mango_6.png"
                full
            />

            <p>
                Теперь нам необходимо добавленный номер активировать ползунком справа и поставить
                первым в списке.
                Просто перетяните его выше всех. А учетную SIP-запись отключите на время переадресации.
                Нажмите кнопку "Сохранить".
            </p>

            <b-image
                src="instructions/mango_7.png"
                full
            />

            <p>
                Все готово! Можно сделать тестовый звонок на свой филиал, а звонок переадресуется на
                указанный номер.
                Важно знать, что звонок со своего номера и переадресация на него не возможна одновременно.
            </p>

            <b-divider />

            <p>
                Если Вы хотите убрать переадресацию и вернуть звонки на базовую станцию,
                то зайдите опять в окно настроек и поменяйте местами контакты.
            </p>

            <b-image
                src="instructions/mango_8.png"
                full
            />
        </div>
    </portal-page>
</template>

<style lang="scss" scoped>
.mango-redirect-view {
    .content {
        @include text-content;
    }
}
</style>
