<script setup lang="ts">
import { computed } from "vue"
import type { CentralOfficeUser } from "@v/portal/_britva/contacts/central-office/defenitions/central-office"
import BTitle from "@c/common/b-title/b-title.vue"
import PortalContent from "@c/portal/portal-content/portal-content.vue"
import BTelnum from "@c/common/b-telnum/b-telnum.vue"
import BImage from "@c/common/b-image/b-image.vue"

const props = defineProps<{
    user: CentralOfficeUser
}>()

const avatar = computed(() => {
    if (props.user.avatar) return props.user.avatar
    return "template/first-avatar.png"
})

</script>

<template>
    <div class="central-office-user">
        <div class="avatar">
            <b-image
                :src="avatar"
                :alt="props.user.name"
                full
            />
        </div>

        <div class="content">
            <div class="user-description">
                <b-title
                    :title="props.user.name"
                    class="name"
                />

                <p
                    v-if="props.user.description"
                    class="description"
                >
                    {{ props.user.description }}
                </p>

                <portal-content
                    v-if="props.user.content"
                    :content="props.user.content"
                    :content-type="props.user.contentType"
                    class="mt-x2"
                />
            </div>

            <div
                v-if="props.user.telnum"
                class="user-contacts"
            >
                <b-telnum :value="props.user.telnum" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.central-office-user {
    display: flex;
    flex-direction: row;

    .avatar {
        width: 255px;
        min-width: 255px;
        height: 255px;
        border-radius: $indent-x4;
        overflow: hidden;
    }

    .content {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 100%;
        min-height: 255px;
        border-radius: $indent-x4;
        border: 1px solid var(--p-divider-border-color);
        padding: $indent-x3 $indent-x4;
    }

    .user-contacts {
        text-align: right;
    }
}
</style>
