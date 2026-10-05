import { ContentType } from "@/definitions/content"

export interface MangoAuditData {
    id:           number
    header:       string
    content?:     string | string[]
    contentType?: ContentType
}
