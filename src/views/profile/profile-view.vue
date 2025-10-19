<script setup lang="ts">
import useAuthStore from "@s/auth/auth"
import type { UserData } from "@/api/modules/auth/definitions/auth"

const authStore = useAuthStore()
const user: UserData = authStore.user
</script>

<template>
<div class="profile-view">
  <div> {{ user.login }}</div>
  <div> {{ user.role }}</div>
  <div> {{ user.name }}</div>
  <div> {{ user.partner?.name }}</div>
  <div> {{ user.avatar }}</div>
  <div> {{ user.email }}</div>
</div>
</template>

<style scoped lang="scss">
.profile-view {

}
</style>
