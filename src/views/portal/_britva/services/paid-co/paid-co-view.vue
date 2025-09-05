<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue"
import VuePdfEmbed, { useVuePdfEmbed } from "vue-pdf-embed"
import { getPublicLink } from "@/lib/link"
import PortalPage from "@c/portal/portal-page/portal-page.vue"

const { doc } = useVuePdfEmbed({
    source: getPublicLink("docs/co-price.pdf")
})

const pageRefs = ref<HTMLElement[]>([])
const pageVisibility = ref<Record<number, boolean>>({})

let pageIntersectionObserver: IntersectionObserver | null = null

const pageNums = computed<number[]>(() =>
    doc.value ? [...Array(doc.value.numPages + 1).keys()].slice(1) : []
)

const resetPageIntersectionObserver = () => {
    pageIntersectionObserver?.disconnect()
    pageIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = pageRefs.value.indexOf(entry.target as HTMLElement)
                const pageNum = pageNums.value[index]
                if (pageNum !== undefined) {
                    pageVisibility.value[pageNum] = true
                }
            }
        })
    })
    pageRefs.value.forEach((element) => {
        if (element) {
            pageIntersectionObserver?.observe(element)
        }
    })
}

watch(pageNums, (newPageNums) => {
    if (newPageNums.length > 0) {
        pageVisibility.value = { [newPageNums[0]]: true }
        nextTick(resetPageIntersectionObserver)
    }
})

onBeforeUnmount(() => {
    pageIntersectionObserver?.disconnect()
})
</script>

<template>
    <portal-page
        class="paid-co-view"
        title="Платные услуги ЦО"
    >
        <div class="pdf-scroll-container">
            <div
                v-for="pageNum in pageNums"
                :key="pageNum"
                ref="pageRefs"
                class="pdf-page-wrapper"
            >
                <vue-pdf-embed
                    v-if="pageVisibility[pageNum]"
                    :source="doc"
                    :page="pageNum"
                />
            </div>
        </div>
    </portal-page>
</template>

<style scoped lang="scss">
.paid-co-view {
    .pdf-page-wrapper {
        padding-bottom: $indent-x1;
    }
}
</style>
