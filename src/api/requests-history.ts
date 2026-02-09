import { HttpMethod } from "@/api/definitions/api"

interface RequestsHistoryInterface {
    url: string
    method: string | undefined
    status: number | undefined
    responseBody?: string
}

class RequestsHistory {
    readonly historySize: number = 15
    public history: (RequestsHistoryInterface | undefined)[] = []
    push(url: string, method: HttpMethod, status: number | undefined, responseBody: unknown): void {
        if (this.history.length === this.historySize) {
            this.history.pop()
        }

        let data: string | undefined
        if (responseBody) {
            data = JSON.stringify(responseBody).substring(0, 1024)
        }

        const historyItem: RequestsHistoryInterface = { url, method, status, responseBody: data }
        this.history.unshift(historyItem)
    }
}

export const requestsHistory = new RequestsHistory()
