<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import BButtonGroup from "@c/common/b-button-groups/b-button-group.vue"
import type { PortalRouteButton } from "@c/portal/portal-button-navigation/definitions/portal-button-navigation"

const props = defineProps<{
    buttons: PortalRouteButton[]
}>()

const route = useRoute()
const router = useRouter()

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
        <b-button-group
            v-for="(button, index) in props.buttons"
            :key="index"
            :label="button.label"
            :active="currentRouteName == button.route"
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
