import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { isDefined } from '@/utilities'

export type ApiConfig = {
  baseUrl: string,
  token?: string | (() => string | undefined),
}

type ConfigFunction<R, T extends ApiConfig = ApiConfig> = (config: T) => R
export type ApiBaseUrl<T extends ApiConfig = ApiConfig> = string | ConfigFunction<string, T>

export const getBaseUrl: ApiBaseUrl = (config) => config.baseUrl

export class Api<T extends ApiConfig = ApiConfig> {
  protected readonly apiConfig: T
  protected apiHeaders: RawAxiosRequestHeaders | AxiosHeaders = {}
  protected apiBaseUrl: ApiBaseUrl = getBaseUrl
  protected routePrefix: string | undefined

  public constructor(apiConfig: T) {
    this.apiConfig = apiConfig
  }

  protected composeBaseUrl(): string {
    if (typeof this.apiBaseUrl === 'string') {
      return this.apiBaseUrl
    }

    return this.apiBaseUrl(this.apiConfig)
  }

  protected composeHeaders(): RawAxiosRequestHeaders | AxiosHeaders {
    const token = typeof this.apiConfig.token === 'function' ? this.apiConfig.token() : this.apiConfig.token

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      }
    }

    return {}
  }

  protected combinePath(route: string | undefined): string {
    const repeatingSlashes = /(\/+)/g

    return [this.routePrefix, route]
      .filter(isDefined)
      .join('/')
      .replace(repeatingSlashes, '/')
  }

  protected instance(): AxiosInstance {
    const config: AxiosRequestConfig = {
      baseURL: this.composeBaseUrl(),
      headers: this.composeHeaders(),
    }

    return axios.create(config)
  }

  protected get<T, R = AxiosResponse<T>>(route?: string, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().get(path, config)
  }

  protected delete<T, R = AxiosResponse<T>>(route?: string, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().delete(path, config)
  }

  protected head<T, R = AxiosResponse<T>>(route?: string, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().head(path, config)
  }

  protected options<T, R = AxiosResponse<T>>(route?: string, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().options(path, config)
  }

  // axios uses any for the data argument

  protected post<T, R = AxiosResponse<T>>(route?: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().post(path, data, config)
  }

  // axios uses any for the data argument

  protected put<T, R = AxiosResponse<T>>(route?: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().put(path, data, config)
  }

  // axios uses any for the data argument

  protected patch<T, R = AxiosResponse<T>>(route?: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)

    return this.instance().patch(path, data, config)
  }
}
