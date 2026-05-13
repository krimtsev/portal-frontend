import { ContentType } from "@/definitions/content"

export interface CentralOfficeUser {
    id:           number
    name:         string
    description?: string
    telnum?:      string
    avatar?:      string
    content?:     string | string[] | undefined
    contentType?: ContentType
}
