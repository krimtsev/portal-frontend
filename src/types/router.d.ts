import "vue-router"
import type { Partner } from "@/definitions/partner"

declare module "vue-router" {
    interface RouteMeta {
        title?:            string
        roles?:            string[]
        partners?:         Partner[]
        breadcrumb?:       string
        breadcrumbHidden?: boolean
    }
}
