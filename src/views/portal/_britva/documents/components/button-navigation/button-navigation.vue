<script setup lang="ts">
import { computed } from "vue"
import BButton from "@c/common/b-button/b-button.vue"
import { PortalRouteName } from "@r/portal/route-names"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const buttons = [
    {
        label: "Общие штрафы",
        route: PortalRouteName.DocumentFines
    },
    {
        label: "Штрафы по аудиту",
        route: PortalRouteName.DocumentFinesAudit
    },
    {
        label: "Манго-аудит",
        route: PortalRouteName.DocumentMangoAudit
    }
]

const currentRouteName = computed(() => {
    return route.name
})

const goToRouteName = (name: PortalRouteName) => {
    if (currentRouteName.value === name) return

    router.push({ name })
}
</script>

<template>
    <div class="button-navigation">
        <b-button
            v-for="(button, index) in buttons"
            :key="index"
            :label="button.label"
            :outline="currentRouteName !== button.route"
            @click="goToRouteName(button.route)"
        />
    </div>
</template>

<style scoped lang="scss">
.button-navigation {
    display: flex;
    margin-bottom: $indent-x3;
    gap: $indent-x1;
}
</style>
