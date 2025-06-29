<script lang="ts" setup>
import { useRouter } from "vue-router"
import BIcon from "@c/common/b-icon/b-icon.vue"

const props = defineProps<{
    title: string,
    path?: string
}>()

const router = useRouter()
const onClick = () => router.push({ path: props.path })
</script>

<template>
    <div class="portal-card">
        <div class="card-title title-lg">{{ props.title }}</div>
        <div class="card-content">
            <slot />
        </div>
        <div
            v-if="props.path"
            class="card-footer"
        >
            <b-icon
                icon="pi pi-angle-right"
                severity="contrast"
                variant="text"
                size="large"
                rounded
                @click="onClick"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.portal-card {
    padding: $indent-x4 ;
    background: rgba(17, 17, 17, 1);
    border-radius: $indent-x4;
    min-height: 192px;
    height: 100%;

    .card {
        &-title {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: $indent-x5;
            padding-left: $indent-x3;
        }

        &-content {
            overflow: hidden;
        }

        &-footer {
            display: flex;
            justify-content: flex-end;
        }
    }

    :deep(.b-icon) {
        .p-button {
            border-color: rgba(255, 255, 255, 0.16);
            width: 38px;
            height: 38px !important;

            .p-button-icon {
                color: white;
            }
        }
    }
}
</style>
