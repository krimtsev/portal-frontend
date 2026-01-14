<script setup lang="ts">
import PortalPage from "@c/portal/portal-page/portal-page.vue"
import { buttonNavigation } from "@v/portal/contacts/_britva/data/button-navigation"
import PortalButtonNavigation from "@c/portal/portal-button-navigation/portal-button-navigation.vue"
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BLink from "@c/common/b-link/b-link.vue"
import BTelnumLink from "@c/common/b-telnum-link/b-telnum-link.vue"
</script>

<template>
    <portal-page
        class="partners-view"
        title="Контакты партнеров с которыми мы взаимодействуем"
    >
        <template #top-side>
            <portal-button-navigation :buttons="buttonNavigation" />
        </template>

        <portal-card title="Карты:">
            <div class="content">
                <ul>
                    <li>
                        Яндекс, Наталья Маленко, заявки писать в <b-link label="форму заявки" href="https://forms.yandex.ru/surveys/10034022.63a13acfcba7c7fdf5501636cc161efa6d3c5a3b/"/> (номер рекламной компании 36409936)
                    </li>
                    <li>
                        2GIS, Данила Егоров, рабочий номер. <b-telnum-link value="74956041055" />  доб. 17715, личный номер <b-telnum-link value="79800052362" />
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
                            <b-telnum-link value="88005050475" /> или в чаты поддержки.
                        </p>
                        <p>Быстрый чат расположен на экране справа внизу - желтый кружок.</p>
                        <p>Контакты менеджера сети в разделе Обзор -> Сводка.</p>
                    </li>
                    <li>
                        Наш персональный менеджер отдела сопровождения Анна Горбачева, <b-telnum-link value="88005050475" />
                        доб. 136 или a.gorbacheva@yclients.tech
                    </li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Mango-Office:">
            <div class="content">
                <ul>
                    <li>
                        По всем техническим вопросам можно обращаться
                        на горячую линию <b-telnum-link value="88005555424" /> круглосуточно.
                    </li>
                    <li>
                        Наш персональный менеджер Сафиуллин Илья, <b-telnum-link value="88005555669" />,
                        доб. 1348 или i.safiullin@mangotele.com
                    </li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="ЗвукБизнес (СберЗвук):">
            <div class="content">
                <ul>
                    <li>
                        Специалист по аудиомаркетингу и подключениям Яна Манькова,
                        mankova-yo@zvuk.com, <b-telnum-link value="88005505994" />, доб. 22
                    </li>
                    <li>
                        Менеджер сопровождения Дарья Першина, pershina-ds@zvuk.com,
                        <b-telnum-link value="88005505994" />, доб. 120
                    </li>
                </ul>
            </div>
        </portal-card>
		
		<portal-card title="РАО и ВОИС (авторские права):">
            <div class="content">
                <ul>
                    <li>
                        Наш менеджер сопровождения Павел Фомин,
                        <b-telnum-link value="79096281245" /> (личный номер)
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
