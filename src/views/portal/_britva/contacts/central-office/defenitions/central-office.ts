import { ContentType } from "@/shared/content/content"

export interface CentralOfficeUser {
    id: number
    name: string
    description?: string
    telnum?: string
    avatar?: string
    content?: string | string[] | undefined
    contentType?: ContentType
}
