export interface CloudFolderItem {
    id: number
    category_id?: number
    folder: string
    name: string
    slug: string
}

export interface CloudFolderBreadcrumb {
    label: string
    path: string
    route?: string
}

export interface CloudFileItem {
    id: number
    title: string
    name: string
    ext: string
}

export interface CloudData {
    files: CloudFileItem[]
    folders: CloudFolderItem[]
    breadcrumbs: CloudFolderBreadcrumb[]
}
