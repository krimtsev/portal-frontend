<script setup lang="ts">
import BImage from "@c/common/b-image/b-image.vue"
</script>

<template>
    <div class="auth-view">
        <div class="logo">
            <b-image src="logos/logo.png" width="80px" />
        </div>

        <div class="wrapper">
            <div class="form">
                <b-image src="logos/logo-large.png" width="100%" />

                <div class="form-card">
                    <p class="title">Ведутся технические работы</p>
                    <p class="description">Обновляем платформу и проводим плановое обслуживание системы. Приносим извинения за временные неудобства.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.auth-view {
    @include flex-center;

    flex-direction: column;
    width: 100%;
    padding: $indent-x2;

    .wrapper {
        @include flex-center;

        width: 100%;
        height: 100%;
        background: $partner-gradient;
        border-radius: $indent-x4;
        padding: $indent-x2;
    }

    .form {
        width: 398px;

        &-card {
            width: 100%;
            height: 218px;
            display: flex;
            flex-direction: column;
            text-align: center;
            margin-top: 25%;
            gap: $indent-x2;
        }
    }

    .logo {
        width: 80px;
        height: 46px;
        margin-bottom: $indent-x2;
    }

    .title {
        @include card-title;
    }

    .description {
        @include p;

        color: var(--p-surface-300);
    }
}
</style>

