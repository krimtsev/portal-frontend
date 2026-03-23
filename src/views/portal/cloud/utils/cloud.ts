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


export const cloudImages: Record<string, string> = {
    docs:                "template/cloud-document.png",
    makets:              "template/cloud-image.png",
    video:               "template/cloud-video.png",
    digests:             "template/cloud-document.png",
    "video-instruction": "template/cloud-video.png",
}

export const rootFolders = Object.keys(cloudImages)
