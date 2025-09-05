<script lang="ts" setup>
import BImage from "@c/common/b-image/b-image.vue"
import BTelnum from "@c/common/b-telnum/b-telnum.vue"

const props = defineProps<{
    avatar?: string,
    telnum?: string,
}>()
</script>

<template>
    <div class="portal-user-card">
        <div
            v-if="props.avatar"
            class="header"
        >
            <b-image
                :src="props.avatar"
                class="avatar"
                :image-style="{
                    'object-fit': 'cover',
                    'width': '100%',
                    'height': '100%',
                    'max-width': '172px'
                }"
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
