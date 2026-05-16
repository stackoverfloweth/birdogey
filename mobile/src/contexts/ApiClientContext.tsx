import { ENV } from 'varlock/env'
import { AuthApi, createUserApi, createAuthApi, createEventApi, createImageKitApi, EventApi, FetchHttpClient, ImageKitApi, UserApi, SeasonApi, createSeasonApi } from '@birdogey/shared'
import { createContext, useContext, useRef } from 'react'
import { getAccessToken } from '@/services/tokenStorage'

export type ApiClient = {
  event: EventApi,
  user: UserApi,
  season: SeasonApi,
  auth: AuthApi,
  imagekit: ImageKitApi,
}

const ApiClientContext = createContext<ApiClient | null>(null)

export function ApiClientProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const apiClient = useRef<FetchHttpClient | null>(null)
  apiClient.current ??= new FetchHttpClient({ baseUrl: ENV.API_BASE_URL, getAccessToken })

  const auth = useRef<AuthApi | null>(null)
  auth.current ??= createAuthApi(apiClient.current)

  const user = useRef<UserApi | null>(null)
  user.current ??= createUserApi(apiClient.current)

  const event = useRef<EventApi | null>(null)
  event.current ??= createEventApi(apiClient.current)

  const season = useRef<SeasonApi | null>(null)
  season.current ??= createSeasonApi(apiClient.current)

  const imagekit = useRef<ImageKitApi | null>(null)
  imagekit.current ??= createImageKitApi(apiClient.current)

  return (
    <ApiClientContext.Provider value={{
      auth: auth.current,
      user: user.current,
      event: event.current,
      season: season.current,
      imagekit: imagekit.current,
    }}
    >
      {children}
    </ApiClientContext.Provider>
  )
}

export function useApiClient(): ApiClient {
  const apiClient = useContext(ApiClientContext)

  if (!apiClient) {
    throw new Error('ApiClient not found')
  }

  return apiClient
}
