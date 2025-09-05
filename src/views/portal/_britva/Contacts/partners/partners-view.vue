<script setup lang="ts">
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/_britva/contacts/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BLink from "@c/common/b-link/b-link.vue"
import BTelnum from "@c/common/b-telnum/b-telnum.vue"
</script>

<template>
    <portal-page
        class="partners-view"
        title="Партнеры"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <portal-card title="Вопросы по картам:">
            <div class="content">
                <ul>
                    <li>
                        Яндекс, Наталья Маленко, заявки писать
                        <b-link label="k.mango-office.ru" href="http://lk.mango-office.ru/"/>
                        (номер рекламной компании 36409936)
                    </li>
                    <li>
                        2GIS, Данила Егоров, рабочий номер. <b-telnum value="74956041055" />  доб. 17715,
                        личный номер <b-telnum value="79800052362" />
                    </li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Yclients:">
            <div class="content">
                <ul>
                    <li>
                        <p>
                            По всем техническим вопросам можно обращаться на горячую линию
                            <b-telnum value="88005050475" /> или в чаты поддержки.
                        </p>
                        <p>Быстрый чат расположен на экране справа внизу - желтый кружок.</p>
                        <p>Контакты менеджера сети в разделе Обзор-Сводка.</p>
                    </li>
                    <li>
                        Наш персональный менеджер отдела сопровождения Анна Горбачева, <b-telnum value="88005050475" />
                        доб. 136 или a.gorbacheva@yclients.tech
                    </li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Mango:">
            <div class="content">
                <ul>
                    <li>
                        По всем техническим вопросам можно обращаться
                        на горячую линию <b-telnum value="88005555424" /> круглосуточно.
                    </li>
                    <li>
                        Наш персональный менеджер Исай Мария, <b-telnum value="88005555669" />,
                        доб. 1151 или m.isay@mangotele.com
                    </li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="ЗвукБизнес (СберЗвук):">
            <div class="content">
                <ul>
                    <li>
                        Специалист по аудиомаркетингу и подключениям Яна Манькова,
                        mankova-yo@zvuk.com, <b-telnum value="88005505994" />, доб. 22
                    </li>
                    <li>
                        Менеджер сопровождения Дарья Першина, pershina-ds@zvuk.com,
                        <b-telnum value="88005505994" />, доб. 120
                    </li>
                </ul>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.partners-view {
    .content {
        @include text-content;
    }
}
</style>
