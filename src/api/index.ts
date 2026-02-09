import axios from "axios"
import type  {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosDefaults,
    AxiosError,
} from "axios"
import qs from "qs"
import { Queue } from "@/api/queue"
import { HttpMethod } from "@/api/definitions/api"
import { requestsHistory } from "@/api/requests-history"
import env from "~/env"

export class HttpError {
    code: number
    message: string

    constructor(code = 500, message = "") {
        this.code = code
        this.message = message
    }
}

export interface CustomAxiosRequestConfig extends Omit<AxiosRequestConfig, "signal"> {
    abortController?: AbortController
}

export interface AbortControllerConfig {
    controller: AbortController
    internal?: boolean
}

const prefix = "api/v1"
const url = env.api

async function authGuard(error: any) {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (
        status === 401 && message === "Unauthenticated" ||
        status === 403 && message === "Forbidden"
    ) {
        //TODO: подумать над разлогированием
        //$itlStore.notify.error()
        //await $itlStore.auth.logout()
    }
}

function pickUpAbortControllerConfigFromCustomConfig(customConfig?: CustomAxiosRequestConfig) {
    let abortController: AbortController
    let internal = false

    if (customConfig?.abortController) {
        abortController = customConfig.abortController
    } else {
        abortController = new AbortController()
        internal = true
    }

    customConfig = { ...(customConfig || {}), abortController }

    return {
        config:                toNativeConfig(customConfig),
        abortControllerConfig: { controller: abortController, internal },
    }
}

function toNativeConfig(customConfig?: CustomAxiosRequestConfig): AxiosRequestConfig | undefined {
    const config: CustomAxiosRequestConfig & AxiosRequestConfig | undefined = customConfig

    if (config) {
        config.signal = config.abortController?.signal
        delete config.abortController
    }

    return config as AxiosRequestConfig
}

class Http {
    private http: AxiosInstance
    public defaults: AxiosDefaults
    public lastRequests = requestsHistory.history

    queue: Queue = new Queue()

    constructor() {
        this.http = axios.create({
            baseURL:          `${url}/${prefix}`,
            paramsSerializer: { serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }) },
            withCredentials: true,
            withXSRFToken: true,
        })
        this.defaults = this.http.defaults

        this.http.interceptors.request.use(config => {
            return config
        })
    }

    async get<T = any>(url: string, customConfig?: CustomAxiosRequestConfig): Promise<Promise<T> | HttpError> {
        try {
            const { config, abortControllerConfig } = pickUpAbortControllerConfigFromCustomConfig(customConfig)
            const request = this.http.get(url, config)
            const res = await this.queue.fetch<T>(url, HttpMethod.GET, request, abortControllerConfig)
            requestsHistory.push(url, HttpMethod.GET, res.status, res.data)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            await authGuard(error)
            requestsHistory.push(url, HttpMethod.GET, error.response?.status, error.response?.data)
            return new HttpError(error.response?.status, error.response?.data?.message)
        }
    }

    async post<T = any>(url: string, data?: unknown, customConfig?: CustomAxiosRequestConfig): Promise<Promise<T> | HttpError> {
        try {
            const { config, abortControllerConfig } = pickUpAbortControllerConfigFromCustomConfig(customConfig)
            const request = this.http.post(url, data, config)
            const res = await this.queue.fetch<T>(url, HttpMethod.POST, request, abortControllerConfig)
            requestsHistory.push(url, HttpMethod.POST, res.status, res.data)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            await authGuard(error)
            requestsHistory.push(url, HttpMethod.POST, error.response?.status, error.response?.data)
            return new HttpError(error.response?.status, error.response?.data?.message)
        }
    }

    async put<T = any>(url: string, data?: unknown, customConfig?: CustomAxiosRequestConfig): Promise<Promise<T> | HttpError> {
        try {
            const res = await this.http.put(url, data, toNativeConfig(customConfig))
            requestsHistory.push(url, HttpMethod.PUT, res.status, res.data)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            await authGuard(error)
            requestsHistory.push(url, HttpMethod.PUT, error.response?.status, error.response?.data)
            return new HttpError(error.response?.status, error.response?.data?.message)
        }
    }

    async patch<T = any>(url: string, data?: unknown, customConfig?: CustomAxiosRequestConfig): Promise<Promise<T> | HttpError> {
        try {
            const res = await this.http.patch(url, data, toNativeConfig(customConfig))
            requestsHistory.push(url, HttpMethod.PATCH, res.status, res.data)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            await authGuard(error)
            requestsHistory.push(url, HttpMethod.PATCH, error.response?.status, error.response?.data)
            return new HttpError(error.response?.status, error.response?.data?.message)
        }
    }

    async delete<T = any>(url: string, customConfig?: CustomAxiosRequestConfig): Promise<Promise<T> | HttpError> {
        try {
            const res = await this.http.delete(url, toNativeConfig(customConfig))
            requestsHistory.push(url, HttpMethod.DELETE, res.status, res.data)
            return res.data
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            await authGuard(error)
            requestsHistory.push(url, HttpMethod.DELETE, error.response?.status, error.response?.data)
            return new HttpError(error.response?.status, error.response?.data?.message)
        }
    }
}

export const http = new Http()

