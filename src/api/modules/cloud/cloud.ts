import { http } from "@/api"
import type { CloudData } from "@v/portal/cloud/definitions/cloud"

interface CloudParams {
    slug?: string,
    search?: string,
}

export async function getData(params: CloudParams) {
    return await http.get<CloudData>("cloud/list", { params })
}

export async function download(name: string) {
    return await http.get<Blob>("cloud/download", {
        params: { name },
        responseType: "blob",
    })
}
