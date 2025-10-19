import type { CloudFolderBreadcrumb } from "@v/portal/cloud/definitions/cloud"

export const normalizeBreadcrumbs = (breadcrumbs?: CloudFolderBreadcrumb[]): CloudFolderBreadcrumb[] => {
    if (!breadcrumbs) return []

    let fullPath = ""

    return breadcrumbs.map((item, index) => {
        if (index === breadcrumbs.length - 1) {
            return { ...item }
        }

        fullPath = fullPath
            ? `${fullPath}/${item.path}`
            : item.path

        return { ...item, route: fullPath }
    })
}
