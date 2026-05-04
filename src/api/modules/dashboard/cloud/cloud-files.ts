import type { CloudFilesResponse } from "@v/dashboard/cloud/edit/definitions/cloud"

import { http } from "@/api"

export async function list(folderId: string) {
    return await http.get<CloudFilesResponse>(`dashboard/cloud/folder/${folderId}/files`)
}

export async function remove(folderId: string, fileId: string | number) {
    return await http.delete<null>(`dashboard/cloud/folder/${folderId}/file/${fileId}`)
}

export async function update(folderId: string, fileId: string | number, data: { title: string }) {
    return await http.put<null>(`dashboard/cloud/folder/${folderId}/file/${fileId}`, data)
}

export async function upload(folderId: string, files: File[]) {
    return await http.post<CloudFilesResponse>(`dashboard/cloud/folder/${folderId}/files`, { files }, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export async function download(folderId: string, name: string) {
    return await http.getFile({
        fileName: name,
        url:      `dashboard/cloud/folder/${folderId}/download`,
    })
}
