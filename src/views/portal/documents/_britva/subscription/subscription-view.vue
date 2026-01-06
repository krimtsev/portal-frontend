<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import PrimeDataTable from "primevue/datatable"
import PrimeColumn from "primevue/column"
import { subscriptionData } from "@v/portal/documents/_britva/subscription/data/subscription-data"
import BImage from "@c/common/b-image/b-image.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        class="subscription-view"
        title="Система работы абониментов"
        right-image="template/abik.png"
    >
        <portal-card title="Годовой абонемент на стрижки и уход">
            <div class="content">
                <p> В сети BRITVA доступны годовые абонементы на стрижки и моделирование бороды. </p>

                <ul>
                    <li>Абонементы действуют 12 месяцев с даты покупки и оформляются на одного гостя.</li>
                    <li>Не суммируются с другими акциями и скидками.</li>
                </ul>

                <b-title
                    title="Что входит в абонемент?"
                    class="mb-x2"
                />

                <ul>
                    <li>10 одноимённых услуг (по выбранному типу).</li>
                    <li>Привязка к конкретному филиалу.</li>
                    <li>Уникальный код филиала на обратной стороне карты (например, NOV06 для Новокосино).</li>
                    <li>Без баланса: оплачиваются только мужские стрижки и/или моделирование бороды.</li>
                    <li>Другие услуги и товары оплачиваются отдельно.</li>
                </ul>
            </div>
        </portal-card>

        <portal-card title="Варианты абонементов:">
            <div class="content">
                <prime-data-table
                    :value="subscriptionData"
                    show-gridlines
                    class="table"
                >
                    <prime-column field="service" header="Услуга"></prime-column>
                    <prime-column field="barber" header="БАРБЕР"></prime-column>
                    <prime-column field="topBarber" header="ТОП-БАРБЕР"></prime-column>
                    <prime-column field="topBarberPlus" header="ТОП-БАРБЕР+"></prime-column>
                    <prime-column field="brandBarber" header="БРЕНД-БАРБЕР"></prime-column>
                    <prime-column field="brandBarberPlus" header="БРЕНД-БАРБЕР+"></prime-column>
                    <prime-column field="brandBarberPro" header="БРЕНД-БАРБЕР ПРО"></prime-column>
                </prime-data-table>
            </div>
        </portal-card>

        <portal-card
            title="Важно знать!"
            v-glow="{ position: 'top-right' }"
        >
            <div class="content">
                <ul>
                    <li>Абонемент действителен только в том филиале, где он был приобретён.</li>
                    <li>Использование в другом филиале запрещено.</li>
                    <li>При продаже абонемента администраторы и мастера не получают процент от продажи.</li>
                    <li>
                        Вознаграждение сотрудников составляет 40% от стоимости конкретной услуги,
                        оплаченной по абонементу.
                    </li>
                </ul>
            </div>

            <b-title
                title="Информация для персонала"
                class="mb-x2"
            />

            <div class="content">
                <ul>
                    <li>
                        В системе Yclients у каждого филиала создаётся категория:
                        Абонементы // СЕТЬ BRITVA
                    </li>
                    <li>Внутри категории находятся все доступные типы абонементов.</li>
                    <li>От продажи этих товаров 0% идет для сотрудников (админов и мастеров).</li>
                    <li>
                        Необходимо обновить схемы расчёта: <br>
						— от продажи всех товаров — 10% <br>
						— от продажи абонементов — 0% <br>
                    </li>
                </ul>
            </div>

            <b-title
                title="Пример:"
                class="mb-x2"
            />

            <b-image
                src="portal/abik-example.png"
                rounded
                full
            />
        </portal-card>

        <portal-card title="Продажа абонемента">
            <div class="content">
                <ul>
                    <li>Перейти в раздел «Продажа товаров»</li>
                    <li>Указать сотрудника, оформившего продажу</li>
                    <li>Ввести данные клиента (номер телефона, имя)</li>
                    <li>В качестве товара выбрать «Годовой абонемент»</li>
                    <li>Ввести уникальный номер абонемента</li>
                    <li>В комментарии к продаже: указать имя клиента, номер и дату продажи (для удобства)</li>
                </ul>
            </div>

            <b-title
                title="Активация абонемента"
                class="mb-x2"
            />

            <div class="content">
                <ul>
                    <li>
                        При первом посещении абонемент автоматически привязывается к номеру телефона клиента
                    </li>
                    <li>Это позволяет идентифицировать абонемент при будущих визитах</li>
                </ul>
            </div>

            <b-title
                title="Использование абонемента"
                class="mb-x2"
            />

            <div class="content">
                <ul>
                    <li>В окне записи нажмите «Сохранить и перейти к оплате»</li>
                    <li>В поле оплаты введите номер абонемента</li>
                    <li>Услуга будет списана с текущего баланса абонемента</li>
                </ul>
            </div>

            <b-title
                title="Проверка остатка услуг"
                class="mb-x2"
            />

            <div class="content">
                <ul>
                    <li>Перейдите в раздел «Клиентская база»</li>
                    <li>Откройте карточку клиента</li>
                    <li>
                        Перейдите во вкладку «Лояльность» — там отображается количество оставшихся
                        услуг по абонементу
                    </li>
                </ul>
            </div>
        </portal-card>
    </portal-page>
</template>

<style lang="scss" scoped>
.subscription-view {
    .content {
        @include text-content;
    }

    :deep(.p-datatable) {
        @include table-outer-borders;

        .p-datatable-header-cell,
        .p-datatable-tbody > tr {
            background: transparent;

        }
    }

}
</style>
