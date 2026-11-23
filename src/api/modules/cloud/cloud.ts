import type { CloudData } from "@v/portal/cloud/definitions/cloud"
import { http } from "@/api"
import { streamFile } from "@/lib/files"

interface CloudParams {
    slug?:   string
    search?: string
}

export async function getData(params: CloudParams) {
    return await http.get<CloudData>("cloud/list", { params })
}

export function download(folderId: number, name: string) {
    const baseURL = (http.defaults.baseURL ?? "").replace(/\/+$/, "")
    const url = `${baseURL}/cloud/folder/${folderId}/download/${encodeURIComponent(name)}`
    streamFile(url)
}
