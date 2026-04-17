export interface HttpClient {
  get: <T>(path: string, params?: Record<string, string>) => Promise<T>,
  post: <T>(path: string, body?: unknown) => Promise<T>,
  put: <T>(path: string, body?: unknown) => Promise<T>,
  delete: <T>(path: string) => Promise<T>,
}

export class ApiError extends Error {
  public readonly status: number

  public constructor(
    status: number,
    statusText: string,
    body?: string,
  ) {
    super(`${status} ${statusText}${body ? `: ${body}` : ''}`)

    this.status = status
    this.name = 'ApiError'
  }
}

export type HttpClientConfig = {
  baseUrl: string,
  getAccessToken: () => string | null | Promise<string | null>,
  onError?: (error: unknown) => void,
}

export class FetchHttpClient implements HttpClient {
  private readonly config: HttpClientConfig

  public constructor(config: HttpClientConfig) {
    this.config = config
  }

  private async headers(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const token = await this.config.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: await this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const responseBody = await response.text().catch(() => undefined)
      const error = new ApiError(response.status, response.statusText, responseBody)
      this.config.onError?.(error)
      throw error
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  public get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<T>('GET', `${path}${query}`)
  }

  public post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  public put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body)
  }

  public delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}
