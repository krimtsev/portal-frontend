import { ContentType } from "@/shared/content/content"

export interface FinesData {
    id: number
    header: string
    price: number
    content?: string | string[]
    contentType?: ContentType
}
