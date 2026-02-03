<script setup lang="ts">
import BImage from "@c/common/b-image/b-image.vue"
import BDivider from "@c/common/b-divider/b-divider.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
</script>

<template>
    <portal-page
        class="yclient-notifications-view"
        title="Как включить всплывающие уведомления Yclients?"
    >
        <portal-card>
            <div class="content">
                <p>
                    Для включения уведомления о входящем звонке или записи клиента в филиал
                    необходимо проделать следущие шаги. Переходим в раздел "Настройки"
                </p>

                <b-image
                    src="instructions/soda_1.png"
                    full
                />

                <p>Далее в раздел "Сотрудники"</p>

                <b-image
                    src="instructions/soda_2.png"
                    full
                />

                <p>
                    Выбираем необходимого пользователя, которому производим настройку.
                    Нажимаем на его имя или роль справа.
                </p>

                <b-image
                    src="instructions/soda_3.png"
                    full
                />

                <p>Открываем вкладку "Уведомления"</p>

                <b-image
                    src="instructions/soda_4.png"
                    full
                />

                <p>Теперь необходимо поставить 2 галочки внизу.</p>

                <b-image
                    src="instructions/soda_5.png"
                    full
                />

                <p>И не забываем нажать кнопку "Сохранить"</p>

                <b-divider />

                <p>Пример рабочей фукнции из другого филиала.</p>

                <b-image
                    src="instructions/soda_6.png"
                    full
                />
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.yclient-notifications-view {
    .content {
        @include text-content;
    }
}
</style>
