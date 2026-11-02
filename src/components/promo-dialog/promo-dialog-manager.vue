<script setup lang="ts">
import { watch } from "vue"
import { useAuthStore } from "@s/auth/auth"
import { usePromoDialogStore } from "@s/promo-dialog/promo-dialog"
import PromoDialogView from "@c/promo-dialog/promo-dialog.vue"

const authStore = useAuthStore()
const promoDialogStore = usePromoDialogStore()

watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
        if (!isAuth) promoDialogStore.reset()
    },
)
</script>

<template>
    <promo-dialog-view
        v-if="promoDialogStore.current"
        :key="promoDialogStore.current.id"
        :dialog="promoDialogStore.current"
        @acknowledge="promoDialogStore.acknowledge"
    />
</template>
