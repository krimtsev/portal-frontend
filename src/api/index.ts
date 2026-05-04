import { useAuthStore } from "@s/auth/auth"
import type {
    AxiosDefaults,
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
} from "axios"
import axios from "axios"
import qs from "qs"

import { HttpMethod } from "@/api/definitions/api"
import { Queue } from "@/api/queue"
import { requestsHistory } from "@/api/requests-history"
import env from "~/env"

export class HttpError {
    code:    number
    message: string
    errors:  Record<string, string[]>

    constructor(code = 500, message = "", errors = {}) {
        this.code = code
        this.message = message
        this.errors = errors
    }
}

export interface CustomAxiosRequestConfig extends Omit<AxiosRequestConfig, "signal"> {
    abortController?: AbortController
    skipAuthGuard?:   boolean
}

export interface AbortControllerConfig {
    controller: AbortController
    internal?:  boolean
}

const prefix = "api/v1"
const url = env.api

async function authGuard(error: any) {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401 && message === "Unauthenticated.") {
        const authStore = useAuthStore()
        await authStore.csrf()
        const success = await authStore.initUserData()

        if (!success) {
            await authStore.reset(true)
        }
    }

    if (status === 403 && message === "Forbidden") {
        //TODO: обработка запрещенных
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
    private http:    AxiosInstance
    public defaults: AxiosDefaults

    queue: Queue = new Queue()

    constructor() {
        this.http = axios.create({
            baseURL:          `${url}/${prefix}`,
            paramsSerializer: {
                serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
            },
            withCredentials: true,
            withXSRFToken:   true,
        })
        this.defaults = this.http.defaults

        this.http.interceptors.request.use(request => {
            return request
        })

        this.http.interceptors.response.use(response => {
            return response
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
            if (!customConfig?.skipAuthGuard) {
                await authGuard(error)
            }
            requestsHistory.push(url, HttpMethod.GET, error.response?.status, error.response?.data)
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
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
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
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
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
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
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
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
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
        }
    }

    async getFile(
        { fileName, url = "", onDownloadProgress, params = {} }:
        { fileName: string, url: string, onDownloadProgress?: (progressEvent: any) => void, params?: Record<string, unknown> },
    ): Promise<Blob | HttpError> {
        try {
            if (!url.endsWith("/")) url += "/"
            const response = await this.http.get(`${url}${fileName}`, {
                responseType: "blob",
                onDownloadProgress,
                params,
            })
            requestsHistory.push(url, HttpMethod.GET, response.status, response.data)
            return new Blob([response.data])
        } catch (err: unknown) {
            const error = err as AxiosError<any>
            requestsHistory.push(url, HttpMethod.GET, error.response?.status, error.response?.data)
            return new HttpError(
                error.response?.status,
                error.response?.data?.message,
                error.response?.data?.errors,
            )
        }
    }
}

export const http = new Http()

