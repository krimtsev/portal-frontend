export enum ChatMessageType {
    Sent = "sent",
    Received = "received",
    System = "system"
}

export interface ChatMessageFile {
    id: number
    title: string
    name: string
    ext: string
    path: string
}
