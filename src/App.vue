<script setup lang="ts">
import { RouterView } from "vue-router"
import PrimeToast from "primevue/toast"
</script>

<template>
    <prime-toast position="top-center" />
    <router-view />
</template>
