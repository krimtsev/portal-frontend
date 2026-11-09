export interface CloudData {
    name:        string
    slug:        string
    category_id: number | null
}

export interface CloudResponse {
    data: CloudData & {
        files:      CloudFile[]
        can_remove: boolean
    }
}

export interface CloudOptionsTreeParams {
    exclude_id?: string
}

export interface CloudFile {
    id:        number
    title:     string
    name:      string
    ext:       string
    downloads: number
    isNew?:    boolean
    date:      string
}

export interface CloudFilesResponse {
    data: CloudFile[]
}
