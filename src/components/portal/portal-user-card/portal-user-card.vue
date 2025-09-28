<script lang="ts" setup>
import { computed } from "vue"
import BTelnum from "@c/common/b-telnum/b-telnum.vue"
import { imageSrc } from "@h/images/images"

const props = defineProps<{
    avatar?: string,
    telnum?: string,
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
            />
        </div>

        <div class="content">
            <slot />
        </div>

        <div
            v-if="props.telnum"
            class="telnum"
        >
            <b-telnum :value="props.telnum" />
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
    border: 1px solid var(--p-surface-600);

    .header {
        .avatar {
            display: inline-block;
            overflow: hidden;
            border-radius: $indent-x4;
            border: 1px solid var(--p-primary-500);
            object-fit: cover;
            width: 172px;
            height: 172px;
        }
    }

    .content {
        margin-top: $indent-x2;
    }

    .telnum {
        margin-top: $indent-x1;

        a {
            color: var(--p-surface-0);
        }
    }
}
</style>
