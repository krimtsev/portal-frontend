<script setup lang="ts">
import { computed } from "vue"
import { imageSrc } from "@h/images/images"
import BTelnumLink from "@c/common/b-link/b-telnum-link.vue"

const props = defineProps<{
    avatar?: string
    telnum?: string
}>()

const src = computed(() => imageSrc(props.avatar))
</script>

<template>
    <div class="portal-user-card">
        <div
            v-if="props.avatar"
            class="header"
        >
            <img
                :src="src"
                class="avatar"
                alt=""
            >
        </div>

        <div class="content">
            <slot />
        </div>

        <div
            v-if="props.telnum"
            class="telnum"
        >
            <b-telnum-link :value="props.telnum" />
        </div>

        <div class="social">
            <!-- TODO: добавить интеграции -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.portal-user-card {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-grow: 1;
    padding: $indent-x4 ;
    background: transparent;
    border-radius: $indent-x4;
    border: 1px solid var(--p-portal-user-card-border-color);

    .header {
        width: 172px;
        height: 172px;
        border-radius: $indent-x4;
        border: 1px solid var(--p-portal-user-card-border-color);
        overflow: hidden;

        .avatar {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .content {
        margin-top: $indent-x2;
    }

    .telnum {
        margin-top: $indent-x1;

        a {
            color: var(--p-portal-user-card-link-color);
        }
    }
}
</style>
