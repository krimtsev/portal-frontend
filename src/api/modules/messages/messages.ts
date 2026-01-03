import { http } from "@/api"

export interface MessageItem {
    id: number,
    title: string,
    description: string,
}

export async function list() {
    return await http.get<{ list: MessageItem[] }>("messages")
}
