<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BTitle from "@c/common/b-title/b-title.vue"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import { subscriptionData } from "@v/portal/_britva/documents/subscription/data/subscription-data"
import BImage from "@c/common/b-image/b-image.vue"
import PortalPage from "@c/portal/portal-page/portal-page.vue"
</script>

<template>
    <portal-page
        class="subscription-view"
        title="Абонементы"
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
                <data-table
                    :value="subscriptionData"
                    show-gridlines
                    class="table"
                >
                    <column field="service" header="Услуга"></column>
                    <column field="barber" header="Барбер"></column>
                    <column field="topBarber" header="Топ-барбер"></column>
                    <column field="brandBarber" header="Бренд-барбер"></column>
                    <column field="brandBarberPlus" header="Бренд-барбер +"></column>
                </data-table>
            </div>
        </portal-card>

        <portal-card title="Важно знать!">
            <div class="content">
                <ul>
                    <li>Абонемент действителен только в том филиале, где он был приобретён.</li>
                    <li>Использование в другом филиале невозможно.</li>
                    <li>При покупке администраторы и мастера не получают процент от продажи.</li>
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
                        Необходимо обновить схемы расчёта: — от продажи товаров (кроме абонементов) —
                        10% — от продажи абонементов — 0%
                    </li>
                </ul>
            </div>

            <b-title
                title="Пример:"
                class="mb-x2"
            />

            <b-image
                src="portal/abik_example.png"
                rounded
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
                        стрижек по абонементу
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
        @include remove-table-outer-borders;

        .p-datatable-header-cell,
        .p-datatable-tbody > tr {
            background: transparent;

        }
    }

}
</style>
