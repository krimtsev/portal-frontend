import { ContentType } from "@/shared/content/content"

export interface MangoAuditData {
    id: number
    header: string
    content?: string | string[]
    contentType?: ContentType
}
