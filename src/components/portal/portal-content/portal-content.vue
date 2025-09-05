<script setup lang="ts">
import { ContentType } from "@/shared/content/content"
import { $sanitizeHtml } from "@/lib/sanitize-html"

interface ContentProps {
    content: string | string[]
    contentType?: ContentType
}

const props = defineProps<ContentProps>()
</script>

<template>
    <div class="portal-content">
        <template v-if="Array.isArray(props.content)">
            <ol v-if="props.contentType == ContentType.Numbered">
                <li
                    v-for="(content, index) in props.content"
                    :key="index"
                >
                    {{ $sanitizeHtml(content) }}
                </li>
            </ol>

            <ul v-else-if="props.contentType == ContentType.Bulleted">
                <li
                    v-for="(content, index) in props.content"
                    :key="index"
                >
                    {{ $sanitizeHtml(content) }}
                </li>
            </ul>

            <template v-else>
                <p
                    v-for="(content, index) in props.content"
                    :key="index"
                >
                    {{ $sanitizeHtml(content) }}
                </p>
            </template>
        </template>

        <p v-else>
            {{ $sanitizeHtml(props.content) }}
        </p>
    </div>
</template>

<style scoped lang="scss">
.portal-content {
    @include text-content;
}
</style>
