import { computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import type { Breadcrumb } from "@/shared/route-meta/route-meta"

export function useBreadcrumbs() {
    const route = useRoute()
    const { t } = useI18n()

    // Берём route.matched реактивно через computed
    const breadcrumbs = computed<Breadcrumb[]>(() => {
        // Берём reactive route.matched и route.meta.breadcrumb
        return route.matched
            .filter(r => r.meta.breadcrumb && !r.meta.breadcrumbHidden)
            .map(r => ({ label: t(r.meta.breadcrumb!) }))
    })

    return { breadcrumbs }
}
