<script setup lang="ts">
import PortalCard from "@c/portal/portal-card/portal-card.vue"
import BImage from "@c/common/b-image/b-image.vue"
import BTelnumLink from "@c/common/b-telnum-link/b-telnum-link.vue"
</script>

<template>
    <div class="fines-right-section">
        <portal-card class="pt-x0">
            <b-image src="template/fines.png" />

            <div class="title mb-x3"> Контроль качества </div>

            <div class="content">
                <p class="mb-x3">
                    В случае набора филиалом от 5 и более баллов, штрафные санкции применяются после повторной проверки.
                    На исправление ошибок даётся 14 календарных дней.
                </p>

                <p class="mb-x3">
                    Отчеты по mango аудированию высылает <br/>
                    Екатерина <b-telnum-link value="+79067019944" />
                </p>

                <p>
                    За остальными разборами вы также можете обращаться к ней.
                </p>
            </div>
        </portal-card>
    </div>
</template>

<style scoped lang="scss">
.fines-right-section {
    flex-grow: initial;
    text-align: center;
    padding: 0 $indent-x3;

    .title {
        @include h1;
    }

    .content {
        @include text-content;
    }

    .telnum {
        color: var(--p-primary-500);
    }
}
</style>
