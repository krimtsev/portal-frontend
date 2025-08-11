<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import BImage from "@c/common/b-image/b-image.vue"
import PortalUserCard from "@c/portal/portal-user-card/portal-user-card.vue"
</script>

<template>
    <div class="subscription-view">
        <b-title
            title="Подписка Яндекс.Карты и 2GIS"
            variant="xl"
            class="mb-x2"
        />

        <div class="grid">
            <div class="col-8">
                <portal-card title="Репутационная поддержка карточки филиала на картах от ЦО">
                    <div class="content">
                        <ol>
                            <li>Контроль карточки филиала</li>
                            <li>Яндекс.Карты и 2GIS + бонус Яндекс.Навигатор</li>
                        </ol>
                    </div>
                </portal-card>

                <portal-card title="Ежемесячно:">
                    <div class="content">
                        <p>Наполнение:</p>

                        <ul>
                            <li>Загрузка витрины, товаров и услуг</li>
                            <li>Загрузка новых фотографий в карточку</li>
                            <li>Удаление некачественных или неэстетичных фото клиентов</li>
                            <li>Добавление в карточку красивых и реальных работ мастеров (фото и видео) **</li>
                            <li>Актуализация и правка меню услуг</li>
                            <li>Добавление фото и описаний услуг</li>
                            <li>Загрузка сетевых видео в карточку</li>
                            <li>Выкладка акций</li>
                            <li>Публикация новостей в раздел «Новости»</li>
                        </ul>

                        <p>Контроль</p>

                        <ul>
                            <li>Ежедневный контроль отзывов</li>
                            <li>Ответы на все клиентские отзывы</li>
                            <li>Удаление негативных отзывов (обжалование и удаление через модерацию)</li>
                            <li>Проставление лайков и дизлайков ко всем отзывам в карточке</li>
                            <li>Контроль приоритетного размещения карточки в выдаче</li>
                            <li>Контроль отображения POI карточки (точка интереса на карте)</li>
                            <li>Загрузка сторис в раздел STORIES в карточке</li>
                            <li>Проверка работоспособности кнопки «Онлайн-запись»</li>
                        </ul>

                        <p>**100% увеличит приток новых гостей - по статистике около 70% клиентов смотрят реальные работы мастеров)</p>
                    </div>
                </portal-card>

                <b-title
                    title="Тарифы на подписку в месяц:"
                    variant="md"
                    class="mb-x2 mt-x4"
                />

                <div class="grid">
                    <div class="col-4">
                        <portal-card>
                            <div class="tariff">
                                <b-image src="portal/two_gis.png" />

                                <b-title
                                    title="Пакет Бизнес"
                                    variant="md"
                                    class="mb-x2"
                                />

                                <p>1900 рублей</p>

                                <p>Яндекс.Карты + Яндекс.Навигатор</p>
                            </div>
                        </portal-card>
                    </div>

                    <div class="col-4">
                        <portal-card>
                            <div class="tariff">
                                <b-image src="portal/two_gis_arrow.png" />

                                <b-title
                                    title="Пакет Премиум"
                                    variant="md"
                                    class="mb-x2"
                                />

                                <p>2900 рублей</p>

                                <p>Яндекс.Карты + 2GIS + Яндекс.Навигатор</p>
                            </div>
                        </portal-card>
                    </div>

                    <div class="col-4">
                        <portal-user-card
                            avatar="portal/service_avatar.png"
                            telnum="79833130820"
                        >
                            <div class="text-center">
                                <p class="mb-x0">Для подключения напишите</p>
                                <p class="mb-x0">Кате Лушниковой</p>
                            </div>
                        </portal-user-card>
                    </div>
                </div>
            </div>

            <div class="col-4">
                <div class="flex-center">
                    <b-image src="portal/two_gis_side.png" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.subscription-view {
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
