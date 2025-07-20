<script setup lang="ts">
import { RouterView } from "vue-router"
import Toast from "primevue/toast"
</script>

<template>
    <toast position="top-center" />
    <router-view />
</template>
