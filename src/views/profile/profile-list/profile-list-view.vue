<script setup lang="ts">
import { useRouter } from "vue-router"
import PortalSectionCard from "@c/portal/portal-section-card/portal-section-card.vue"
import { ProfileRouteName } from "@r/profile/route-names"

const router = useRouter()

const goTo = (name: ProfileRouteName) => router.push({ name })
</script>

<template>
    <div class="profile-view">
        <div class="grid grid-stretch-rows gap-3">
            <div class="col-3 tablet-col-4 mobile-col-12">
                <portal-section-card
                    title="Информация о пользователе"
                    description="Персональные данных и параметры учетной записи пользователя."
                    icon="pi-id-card"
                    @click="goTo(ProfileRouteName.ProfileUserProfile)"
                />
            </div>

            <div class="col-3 tablet-col-4 mobile-col-12">
                <portal-section-card
                    icon="pi-key"
                    title="Смена пароля"
                    description="Обновите пароль для обеспечения безопасности вашей учетной записи."
                    @click="goTo(ProfileRouteName.ProfileChangePassword)"
                />
            </div>

            <!-- <div class="col-3 tablet-col-4 mobile-col-12">
                <portal-section-card
                    icon="pi-chart-bar"
                    title="Аналитика по филиалу"
                    description="Получите ключевые отчеты и метрики для оценки работы филиала. Анализируйте производительность, финансовые показатели и другие ключевые данные для принятия обоснованных решений."
                    @click="goTo(ProfileRouteName.ProfileAnalytics)"
                />
</div> -->


            <div class="col-3 tablet-col-4 mobile-col-12">
                <portal-section-card
                    icon="pi-book"
                    title="Заявки"
                    description="Единый центр для создания и отслеживания служебных заявок. Оформляйте запросы на разработку дизайн-материалов, запросы на повышение квалификации сотрудников."
                    @click="goTo(ProfileRouteName.ProfileTickets)"
                />
            </div>

            <!--            <div class="col-3 tablet-col-4 mobile-col-12">-->
            <!--                <portal-section-card-->
            <!--                    icon="pi-users"-->
            <!--                    title="Команда"-->
            <!--                    description="Полный контроль над данными сотрудников: добавляйте новых специалистов, редактируйте информацию о должности, контактах и статусе."-->
            <!--                    @click="goTo(ProfileRouteName.ProfileTeam)"-->
            <!--                />-->
            <!--            </div>-->
        </div>
    </div>
</template>
