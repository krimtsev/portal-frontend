<script setup lang="ts">
import { computed } from "vue"
import BButton from "@c/common/b-button/b-button.vue"
import { PortalRouteName } from "@r/portal/route-names"
import { useRoute, useRouter } from "vue-router"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

const route = useRoute()
const router = useRouter()

const props = defineProps<{
    buttons: PortalRouteButton[]
}>()

const currentRouteName = computed(() => {
    return route.name
})

const goToRouteName = (name: PortalRouteName) => {
    if (currentRouteName.value === name) return

    router.push({ name })
}
</script>

<template>
    <div class="portal-button-navigation">
        <b-button
            v-for="(button, index) in props.buttons"
            :key="index"
            :label="button.label"
            :outline="currentRouteName !== button.route"
            @click="goToRouteName(button.route)"
        />
    </div>
</template>

<style scoped lang="scss">
.portal-button-navigation {
    display: flex;
    margin-bottom: $indent-x3;
    gap: $indent-x1;
}
</style>
