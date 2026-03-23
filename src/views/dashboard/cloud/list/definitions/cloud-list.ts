import type { TreeNode } from "primevue/treenode"

export enum CloudType {
    Folder = "folder",
    File = "file"
}

export interface CloudListItem extends TreeNode {
    data: {
        id:   number
        name: string
        type: CloudType
        ext?: string
        downloads?: number
        slug?: string
        path?: string
    }
}

export interface CloudOptionItem {
    id:   number,
    name: string
}

export interface CloudOptionsResponse {
    list: CloudOptionItem[]
}
