import { HttpMethod } from "@/api/definitions/api"
import type { AxiosResponse } from "axios"
import type { AbortControllerConfig } from "@/api/index"

export class Queue {
    private requestPool = new Map<string, AbortControllerConfig>()

    async fetch<T>(
        url: string,
        method: HttpMethod,
        request: Promise<AxiosResponse<T>>,
        abortControllerConfig: AbortControllerConfig,
    ) {
        const key = `${method}:${url}`

        // Если есть такой же предыдущий запрос и он не прерван - прерываем его
        if (!this.requestPool.get(key)?.controller.signal.aborted) {
            this.requestPool.get(key)?.controller.abort()
        }

        this.requestPool.set(key, abortControllerConfig)

        try {
            return await request
        } catch (exception) {
            if (this.isInternalAbort(abortControllerConfig)) await endless()

            throw exception
        }
    }

    isInternalAbort(abortControllerConfig: AbortControllerConfig) {
        return abortControllerConfig.internal && abortControllerConfig.controller.signal.aborted
    }
}

async function endless() {
    await new Promise(() => ({}))
}
